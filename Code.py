

import streamlit as st
import pickle
import pandas as pd
import numpy as np
from PIL import Image
model = pickle.load(open(r'C:\Users\aiden\Desktop\Intershipsss\Project 8\main\model.sav', 'rb'))

st.header(":green[Heart Disease Prediction using Machine Learning]")
st.markdown("""<b>Heart disease is a critical condition that affects the heart and can
            be life-threatening.Heart disease prediction using machine learning
            is a topic that involves applying various machine learning techniques
            to analyze and classify data related to heart health. The goal is to accurately 
            diagnose the risk of heart disease based on various factors, such as age,
            blood pressure, cholesterol, etc.</b>""",unsafe_allow_html=True)
                  
st.sidebar.header(':orange[Heart Disease Parameters]')


image2=Image.open("C:/Users/aiden/Desktop/Intershipsss/Project 8/main/machine learning.jpeg")
st.image(image2,'')
st.header(":green[How Model is Working in Brief]")
image3=Image.open("C:/Users/aiden/Desktop/Intershipsss/Project 8/main/Model.png")
st.image(image3,'')

st.header(":green[Facts about Heart disease]")
image0=Image.open("C:/Users/aiden/Desktop/Intershipsss/Project 8/main/facts.png")
st.image(image0,'')
st.write("")
st.header(":green[Stay Healthy ♥]")

image4=Image.open("C:/Users/aiden/Desktop/Intershipsss/Project 8/main/health.jpg")
st.image(image4,'')



st.header(":green[Attribute information]")
st.markdown("""<b>:orange[1)Age]: The age of the patient.<br>
:orange[2)Sex]: The gender of the patient.<br>
:orange[3)Chest pain type]: A categorical attribute indicating the type of chest pain
experienced by the patient. It has four possible values.<br>
:orange[4)Resting blood pressure]: The resting blood pressure of the patient.<br>
:orange[5)Serum cholestoral]: The serum cholesterol level in mg/dl of the patient.<br>
:orange[6)Fasting blood sugar]: Indicates whether the patient's fasting blood sugar is
greater than 120 mg/dl.<br>
:orange[7)Resting electrocardiographic results]: A categorical attribute representing
the results of the resting electrocardiogram. It has three possible values.<br>
:orange[8)Maximum heart rate achieved]: The maximum heart rate achieved by the patient.<br>
:orange[9)Exercise induced angina]: Indicates whether the patient experienced angina
(chest pain) induced by exercise.<br>
:orange[10)Oldpeak]: ST depression induced by exercise relative to rest.<br>
:orange[11)Slope]: The slope of the peak exercise ST segment.<br>
:orange[12)Heart Disease]: The target column serves as the outcome variable and indicates
the presence of heart disease in the patient. A value of 0 signifies the absence
of heart disease, while a value of 1 indicates the presence of heart disease.</b>""",unsafe_allow_html=True)



#function

def user_input():
    st.subheader(":green[Select values based on these parameters]")
    Age=st.sidebar.number_input('Age',1,100 )
    Sex=st.sidebar.number_input('Sex', 0,1)
    st.write(":red[Sex-] 0 --> female, 1-->male")
    ChestPainType=st.sidebar.number_input('ChestPainType', 0,3)
    st.write(":red[ChestPainType-] 1 ->ata, 2 -> nap,  0->ASY, 3->TA")
    RestingBP=st.sidebar.number_input('RestingBP',0,210)
    Cholesterol=st.sidebar.number_input('Cholesterol',0,700)
    FastingBS=st.sidebar.number_input('FastingBS',0,1)
    st.write("0 -->no fasting, 1-->fasting")
    RestingECG=st.sidebar.number_input('RestingECG',1,3)
    st.write("1-->Normal, 2-->ST, 3-->LVH")
    MaxHR=st.sidebar.number_input("MaxHR",50,210)
    ExerciseAngina=st.sidebar.number_input("ExerciseAngina",0,1)
    st.write("0 -->N, 1--> Y")
    Oldpeak=st.sidebar.number_input("Oldpeak",-3,8)
    ST_Slope=st.sidebar.number_input("ST_Slope",0,2)
    st.write("2-->up, 1-->flat, 0-->down")
    
    
    user_report_data={
        'Age':Age,
        'Sex':Sex,
        'ChestPainType':ChestPainType,
        'RestingBP':RestingBP,
        'Cholesterol':Cholesterol,
        'FastingBS':FastingBS,
        'RestingECG':RestingECG,
        'MaxHR':MaxHR,
        'ExerciseAngina':ExerciseAngina,
        'Oldpeak':Oldpeak,
        'ST_Slope':ST_Slope
        }
    report_data = pd.DataFrame(user_report_data, index=[0])
    return report_data
user_data =user_input()
st.subheader(":green[Heart Data]")
df=pd.read_csv(r"C:\Users\aiden\Desktop\Intershipsss\Project 8\main\heart.csv")
st.write(df)
predictions=model.predict(user_data)
if st.button("Predict"):
    st.subheader(str(np.round(predictions[0], 2)))
    st.text("""0 means person won't get any heart attack,
1 means there might be chance for him to get heart attack""")
    st.markdown("<b>:blue[predicted correctly] </b>",unsafe_allow_html=True)