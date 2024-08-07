import pandas as pd
import plotly.express as px
from flask_login import login_required

from models import Medicines, Patients, Users, Wards


def all_plots(type, x, y, df):
    all_plots = {
        'line': line_plot,
        'bar': bar_plot,
        'scatter': scatter_plot,
        'pie': pie_plot,
        'hist': hist_plot,
        'box': box_plot,
        'violin': violin_plot,
    }

    if type not in all_plots:
        return None
    return all_plots[type](df, x, y)

def line_plot(df, x, y):
    fig = px.line(df, x=x, y=y)
    return fig

def bar_plot(df, x, y):
    fig = px.bar(df, x=x, y=y)
    return fig

def scatter_plot(df, x, y):
    fig = px.scatter(df, x=x, y=y)
    return fig

def pie_plot(df, x, y):
    fig = px.pie(df, values=y, names=x)
    return fig

def hist_plot(df, x, y):
    fig = px.histogram(df, x=x, y=y)
    return fig

def box_plot(df, x, y):
    fig = px.box(df, x=x, y=y)
    return fig

def violin_plot(df, x, y):
    fig = px.violin(df, x=x, y=y)
    return fig

def plotly_to_html(fig):
    if fig is None:
        return ''
    return fig.to_html(full_html=False)

def main(x, y, type_p, table_name):
    if table_name == 'Users':
        data = Users.query.all()
        data_dict = {
            'id': [d.id for d in data],
            'username': [d.username for d in data],
            'password': [d.password for d in data],
            'is_admin': [d.is_admin for d in data],
            'date_created': [d.date_created for d in data],
        }
    elif table_name == 'Medicines':
        data = Medicines.query.all()
        data_dict = {
            'id': [d.id for d in data],
            'name': [d.name for d in data],
            'date_created': [d.date_created for d in data],
            'patient_id': [d.patient_id for d in data],
        }
    elif table_name == 'Wards':
        data = Wards.query.all()
        data_dict = {
            'id': [d.id for d in data],
            'name': [d.name for d in data],
        }
    elif table_name == 'Patients':
        data = Patients.query.all()
        data_dict = {
            'id': [d.id for d in data],
            'first_name': [d.first_name for d in data],
            'last_name': [d.last_name for d in data],
            'father_name': [d.father_name for d in data],
            'age': [d.age for d in data],
            'cnic': [d.cnic for d in data],
            'ward_id': [d.ward_id for d in data],
            'date_created': [d.date_created for d in data],
            'phone': [d.phone for d in data],
            'mrn': [d.mrn for d in data],
            'gender': [d.gender for d in data],
            'medicine_id': [d.medicine_id for d in data],
        }
    else:
        print(f'Error: {table_name} not found')
        return None

    df = pd.DataFrame(data_dict)

    if x not in df.columns or y not in df.columns:
        print(f'Error: {x} or {y} not in DataFrame columns')
        return None

    fig = all_plots(type_p, x, y, df)
    return plotly_to_html(fig)

