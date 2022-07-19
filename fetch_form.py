import requests
import json
import csv

def reload_form():
    print("Form Data Reloaded")
    f = open('config.json',)
    data = json.load(f)
    f.close()

    url = data["sheet_url"]
    r = requests.get(url, allow_redirects=True)

    open('students.csv', 'wb').write(r.content)

def search_someone(username,_try = 0):
    try:
        students = open("students.csv",encoding='utf-8')
        students_list = csv.reader(students,delimiter=',')
        index = 0
        for i in students_list:
            if(index):
                if(username == i[3].replace("@","")):
                    return i
            index = index + 1
        if(not _try):
            reload_form()
            search_someone(username,1)
        else:
            return False
    except Exception as e:
        print(e)
        reload_form()
        return search_someone(username)
