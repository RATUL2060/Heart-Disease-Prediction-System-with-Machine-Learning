from fastapi import APIRouter, HTTPException, Query, Depends
import httpx
from typing import Optional

router = APIRouter(
    prefix="/nearby",
    tags=["Nearby Care"],
    responses={404: {"description": "Not found"}},
)

# Standard User-Agent is required by OpenStreetMap APIs
HEADERS = {
    "User-Agent": "CardioSenseAI/1.0 (contact@cardiosense.com)"
}

@router.get("/search")
async def search_location(q: str = Query(..., description="Location search query (e.g., 'Brooklyn, NY')")):
    """Geocodes a search string into latitude and longitude using OSM Nominatim."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": q,
        "format": "json",
        "limit": 5
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, headers=HEADERS, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            return data
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error contacting geocoding service: {str(e)}")


@router.get("/facilities")
async def get_facilities(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    radius: int = Query(5000, description="Search radius in meters")
):
    """Finds hospitals, clinics, and cardiologists around a specific point using OSM Overpass API."""
    url = "https://overpass-api.de/api/interpreter"
    
    # Query for hospitals, clinics, and cardiologists within radius
    overpass_query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:{radius},{lat},{lon});
      way["amenity"="hospital"](around:{radius},{lat},{lon});
      relation["amenity"="hospital"](around:{radius},{lat},{lon});
      node["healthcare"="clinic"](around:{radius},{lat},{lon});
      node["healthcare"="cardiologist"](around:{radius},{lat},{lon});
    );
    out center;
    """
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, data=overpass_query, headers=HEADERS, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            
            # Format the data for the frontend
            facilities = []
            for element in data.get("elements", []):
                tags = element.get("tags", {})
                
                # Determine coordinate based on element type
                f_lat = element.get("lat") or (element.get("center", {}).get("lat"))
                f_lon = element.get("lon") or (element.get("center", {}).get("lon"))
                
                if not f_lat or not f_lon:
                    continue
                    
                name = tags.get("name", "Unnamed Facility")
                f_type = tags.get("amenity") or tags.get("healthcare", "healthcare facility")
                address = f"{tags.get('addr:street', '')} {tags.get('addr:housenumber', '')}".strip()
                if not address:
                    address = tags.get("address", "Address unavailable")
                phone = tags.get("phone", tags.get("contact:phone", ""))
                website = tags.get("website", tags.get("contact:website", ""))
                
                facilities.append({
                    "id": element.get("id"),
                    "name": name,
                    "type": f_type.capitalize(),
                    "lat": f_lat,
                    "lon": f_lon,
                    "address": address,
                    "phone": phone,
                    "website": website
                })
                
            return {"facilities": facilities}
            
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error contacting facility service: {str(e)}")
