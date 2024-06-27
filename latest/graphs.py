import matplotlib.pyplot as plt
import pandas as pd
import plotly.express as px
from models import User


def all_plots(type, x, y):
    all_plots = {
        'line': line_plot,
        'bar': bar_plot,
        'scatter': scatter_plot,
        'pie': pie_plot,
        'hist': hist_plot,
        'box': box_plot,
        'violin': violin_plot,
    }

    data = User.query.get(1)
    try:
        df = pd.read_json(data.data)
        print(df)
    except:
        return None
    if x not in df.columns or y not in df.columns:
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
    fig = px.pie(df, x, y)
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
    fig = all_plots(type_p, x, y)
    return plotly_to_html(fig)
