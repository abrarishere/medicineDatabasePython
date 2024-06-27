import matplotlib.pyplot as plt
import pandas as pd
import plotly.express as px
from flask import jsonify, request
from flask_login import login_required

from models import User


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

def main(x, y, type_p):
    data = User.query.all()
    
    # Initialize lists to collect user attributes
    ids, usernames, passwords, is_admins, date_created = [], [], [], [], []

    # Iterate over all users and collect their attributes
    for user in data:
        ids.append(user.id)
        usernames.append(user.username)
        passwords.append(user.password)
        is_admins.append(user.is_admin)
        date_created.append(user.date_created)  # Assuming date_created is a datetime field in User model

    # Create a DataFrame from the collected data
    data_dict = {
        'id': ids,
        'username': usernames,
        'password': passwords,
        'is_admin': is_admins,
        'date_created': date_created
    }
    df = pd.DataFrame(data_dict)
    
    print(f'DataFrame columns: {df.columns}')
    print(f'Form x: {x}, y: {y}, type_p: {type_p}')

    if x not in df.columns or y not in df.columns:
        print(f'Error: {x} or {y} not in DataFrame columns')
        return None

    fig = all_plots(type_p, x, y, df)
    return plotly_to_html(fig)

