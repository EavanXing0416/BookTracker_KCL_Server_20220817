# coding:utf8

#from logging import StrFormatStyle
#import os

from flask import Flask, render_template, request, url_for,jsonify, redirect
from pandas.core.indexes.base import ensure_index
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
import pymysql
import numpy as np
import pandas as pd
import json

import config

app = Flask(__name__)
app.config.from_object(config)
db = SQLAlchemy(app)

#import Dante_Original,Dante_Flat,Dante_Prov,Dante_Prov_StartEnd from csv

Dante_Original_csv=pd.read_csv("./static/data/Dante1481_cleaned.csv")
Dante_Flat_csv=pd.read_csv("./static/data/Dante1481_flat.csv")
Dante_ProvPath_csv=pd.read_csv("./static/data/Dante1481_provpath_new.csv")
Dante_ProvStartEnd_csv=pd.read_csv("./static/data/Dante1481_pathstartend.csv",sep=',\s|,')
#print(Dante_ProvStartEnd_csv[Dante_ProvStartEnd_csv.end_area_name.isin(['United Kingdom'])])

#print(Dante_ProvStartEnd_csv)
id_selected_csv=Dante_Original_csv.Id.tolist()#default id_selected
#print('all data id from csv',id_selected_csv,len(id_selected_csv),'records in total')

#functions to find the selected ids
# Find the unique copy id in Dante_ProvPath Table based on users'choice
global returnSelectedIdImprint
def returnSelectedIdImprint(res_start,res_end,res_locationfrom,res_locationto):
        # search from the start status 
    print(res_locationfrom)
    if res_start[0] == '':
        start_year1 = 1400
    else:
        start_year1 = int(res_start[0])
        
    if res_end[0] == '':
            end_year1 = 2500
    else:
            end_year1 = int(res_end[0])
    book_selected_start_imprint = Dante_ProvStartEnd_csv[(Dante_ProvStartEnd_csv['start_time'] >= start_year1) & (Dante_ProvStartEnd_csv['start_time'] <= end_year1)]
    print(book_selected_start_imprint['start_area_name'])

    if res_locationfrom[0] == '' : #countryfrom is null, use countryfromexclude value
        print('from country include: ', res_locationfrom[0].split(','))
        print('from country exclude: ', res_locationfrom[1].split(','))
        book_selected_start_imprint = book_selected_start_imprint[~book_selected_start_imprint['start_area_name'].isin(res_locationfrom[1].split(','))]
    else:
        book_selected_start_imprint = book_selected_start_imprint[book_selected_start_imprint['start_area_name'].isin(res_locationfrom[0].split(','))]

    if res_locationfrom[2] == '' :
        book_selected_start_imprint = book_selected_start_imprint[~book_selected_start_imprint['start_place_name'].isin(res_locationfrom[3].split(','))]
    else:
        book_selected_start_imprint = book_selected_start_imprint[book_selected_start_imprint['start_place_name'].isin(res_locationfrom[2].split(','))]
        
    id_selected_start_imprint = book_selected_start_imprint['Id'].tolist()
    #provid_selected_start = book_selected_start['auto_id'].tolist()
    
    #id_selected_start = list(set(bookid_selected_start))#delete the dupilicated ids

    #continue to search the end status from the start status
    ## for each book id selected from the start status, check wheter there is one record suitable for the end status
    
    if res_start[1] == '':
        start_year2 = 1400
    else:
        start_year2 = int(res_start[1])
        
    if res_end[1] == '':
            end_year2 = 2500
    else:
            end_year2 = int(res_end[1])
    book_selected_end_imprint = Dante_ProvStartEnd_csv[(Dante_ProvStartEnd_csv['end_time'] >= start_year2) & (Dante_ProvStartEnd_csv['end_time'] <= end_year2)]
    print(book_selected_end_imprint[book_selected_end_imprint['end_area_name'].isin(['Italy'])])
    if res_locationto[0] == '' : 
        book_selected_end_imprint = book_selected_end_imprint[~book_selected_end_imprint['end_area_name'].isin(res_locationto[1].split(','))]
    else:
        book_selected_end_imprint = book_selected_end_imprint[book_selected_end_imprint['end_area_name'].isin(res_locationto[0].split(','))]

    if res_locationto[2] == '' :
        book_selected_end_imprint = book_selected_end_imprint[~book_selected_end_imprint['end_place_name'].isin(res_locationto[3].split(','))]
    else:
        book_selected_end_imprint = book_selected_end_imprint[book_selected_end_imprint['end_place_name'].isin(res_locationto[2].split(','))]
        
    id_selected_end_imprint = book_selected_end_imprint['Id'].tolist()
    #provid_selected_end = book_selected_end['auto_id'].tolist()
    
    #id_selected_end = list(set(bookid_selected_end))#delete the dupilicated ids
           
    print('these are the selected _imprint unique ids:')
    print('book id selected _imprint start:',id_selected_start_imprint)
    print('start _imprint id len:',len(id_selected_start_imprint))
    print('')
    print('book id selected _imprint end:',id_selected_end_imprint)
    print('end _imprint id len:',len(id_selected_end_imprint))
    print(' ')
        
    global id_selected_imprint
    id_selected_imprint = list(set(id_selected_start_imprint) & set(id_selected_end_imprint))
    print('final ids',id_selected_imprint)
    print('final id len', len(id_selected_imprint))
        
    global provid_selected_imprint
    provid_selected_imprint = Dante_ProvPath_csv[Dante_ProvPath_csv['Id'].isin(id_selected_imprint)]['auto_id'].tolist()
    print('prov ids: ', provid_selected_imprint)

    return([id_selected_imprint,provid_selected_imprint])

global returnSelectedId
def returnSelectedId(res_start,res_end,res_locationfrom,res_locationto):
        # search from the start status 
    if res_start[0] == '':
        start_year1 = 1400
    else:
        start_year1 = int(res_start[0])
        
    if res_end[0] == '':
            end_year1 = 2500
    else:
            end_year1 = int(res_end[0])
    book_selected_start = Dante_ProvPath_csv[(Dante_ProvPath_csv['time1'] >= start_year1) & (Dante_ProvPath_csv['time1'] <= end_year1)]
    #print(book_selected_start)

    if res_locationfrom[0] == '' : #countryfrom is null, use countryfromexclude value
        #print('from country include: ', res_locationfrom[0].split(','))
        #print('from country exclude: ', res_locationfrom[1].split(','))
        book_selected_start = book_selected_start[~book_selected_start['area1'].isin(res_locationfrom[1].split(','))]
    else:
        book_selected_start = book_selected_start[book_selected_start['area1'].isin(res_locationfrom[0].split(','))]

    if res_locationfrom[2] == '' :
        book_selected_start = book_selected_start[~book_selected_start['place1'].isin(res_locationfrom[3].split(','))]
    else:
        book_selected_start = book_selected_start[book_selected_start['place1'].isin(res_locationfrom[2].split(','))]
        
    bookid_selected_start = book_selected_start['Id'].tolist()
    provid_selected_start = book_selected_start['auto_id'].tolist()
    
    id_selected_start = list(set(bookid_selected_start))#delete the dupilicated ids

    #continue to search the end status from the start status
    ## for each book id selected from the start status, check wheter there is one record suitable for the end status
    
    if res_start[1] == '':
        start_year2 = 1400
    else:
        start_year2 = int(res_start[1])
        
    if res_end[1] == '':
            end_year2 = 2500
    else:
            end_year2 = int(res_end[1])
    book_selected_end = Dante_ProvPath_csv[(Dante_ProvPath_csv['time2'] >= start_year2) & (Dante_ProvPath_csv['time2'] <= end_year2)]

    if res_locationto[0] == '' : 
        book_selected_end = book_selected_end[~book_selected_end['area2'].isin(res_locationto[1].split(','))]
    else:
        book_selected_end = book_selected_end[book_selected_end['area2'].isin(res_locationto[0].split(','))]

    if res_locationto[2] == '' :
        book_selected_end = book_selected_end[~book_selected_end['place2'].isin(res_locationto[3].split(','))]
    else:
        book_selected_end = book_selected_end[book_selected_end['place2'].isin(res_locationto[2].split(','))]
        
    bookid_selected_end = book_selected_end['Id'].tolist()
    provid_selected_end = book_selected_end['auto_id'].tolist()
    
    id_selected_end = list(set(bookid_selected_end))#delete the dupilicated ids
        
    '''    
    print('these are the selected unique ids:')
    print('book id selected start:',id_selected_start)
    print('start id len:',len(id_selected_start))
    print('')
    print('book id selected end:',id_selected_end)
    print('end id len:',len(id_selected_end))
    print('')
    '''
    global provid_selected    
    provid_selected = []
    global id_selected
    id_selected = list(set(id_selected_start) & set(id_selected_end))
    #print('final ids',id_selected)
    #print('final id len', len(id_selected))
        
    for item in id_selected: 
        start_index = bookid_selected_start.index(item)
        prov_start = provid_selected_start[start_index]
        end_index = bookid_selected_end.index(item)
        prov_end = provid_selected_end[end_index]
        provid = range(prov_start, prov_end+1)
        #print('bookid:',item, 'prov ids: ', provid)
        provid_selected += provid

    return([id_selected,provid_selected])



@app.route('/',methods=['GET','POST'])
def index():
    return render_template('view.html')

@app.route('/base/')
def base():
    return render_template('base.html')


@app.route('/iter2/',methods=['GET', 'POST'])
def iter2():
    
    return render_template('iter2.html')


@app.route('/send_message', methods=['GET','POST'])
def send_message():
    global message_get
    message_get = []
    if request.method=='POST':
        message_get = [request.form['start'], request.form['end'], request.form['areafrom'],request.form['areato'] ]#input提交
    print("收到前端发过来的信息：%s" % message_get)
    print("收到数据的类型为：" + str(type(message_get)))

    global flatdata,filterdata,filterId
    
    flatdata=pd.read_csv('C:\\Users\\xingy\\OneDrive\\Desktop\\BookTrade\\Dante1481_provpath.csv')
    if message_get[0]=='':
        message_get[0]='1481'
    if message_get[1]=='':
        message_get[1]='2021'
    print(message_get)
    if message_get[2]=='' and message_get[3]!='':
        filterdata=flatdata[(flatdata.time1>=int(message_get[0])) & (flatdata.time2<=int(message_get[1])) & (flatdata.area2==message_get[3])]
    elif message_get[3]==''and message_get[2]!='':
        filterdata=flatdata[(flatdata.time1>=int(message_get[0])) & (flatdata.time2<=int(message_get[1])) & (flatdata.area1==message_get[2])]
    elif message_get[2]=='' and message_get[3]=='':
        filterdata=flatdata[(flatdata.time1>=int(message_get[0])) & (flatdata.time2<=int(message_get[1]))]
    else:
        filterdata=flatdata[(flatdata.time1>=int(message_get[0])) & (flatdata.time2<=int(message_get[1])) & (flatdata.area1==message_get[2]) & (flatdata.area2==message_get[3])]
    
    filterId=list(filterdata.Id.unique()) 
    #print(filterdata)

    return filterdata.to_json(orient='records')


@app.route('/view_send',methods=['POST','GET'])

def view_send():
    if request.method=='POST':
        res_start=request.get_json()['start']
        res_end=request.get_json()['end']
        res_locationfrom=request.get_json()['locationfrom']
        res_locationto=request.get_json()['locationto']
        res_data=[res_start,res_end,res_locationfrom,res_locationto]
        print('get the data:', res_data)
        print('from country include: ', res_locationfrom[0].split(','))
        print('from country exclude: ', res_locationfrom[1].split(','))
        print('from city include: ', res_locationfrom[2].split(','))
        print('from city exclude: ', res_locationfrom[3].split(','))
        print('to country include: ', res_locationto[0].split(','))
        print('to country exclude: ', res_locationto[1].split(','))
        print('to city include: ', res_locationto[2].split(','))
        print('to city exclude: ', res_locationto[3].split(','))

        id_selected=returnSelectedId(res_start,res_end,res_locationfrom,res_locationto)[0]
        provid_selected=returnSelectedId(res_start,res_end,res_locationfrom,res_locationto)[1]

        id_selected_imprint=returnSelectedIdImprint(res_start,res_end,res_locationfrom,res_locationto)[0]
        provid_selected_imprint=returnSelectedIdImprint(res_start,res_end,res_locationfrom,res_locationto)[1]
    return json.dumps({'id':id_selected,'prov_id':provid_selected,'id_imprint':id_selected_imprint,'prov_id_imprint':provid_selected_imprint})


@app.route("/view", methods=['GET','POST'])
def view():
    return render_template("view.html")

@app.route("/edgebundling", methods=['GET','POST'])
def edgebundling():
    return render_template("edgebundling.html")

@app.route("/heatmap", methods=['GET','POST'])
def heatmap():
    return render_template("heatmap.html")



if __name__ == '__main__':
    app.run(debug=True)