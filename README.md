# Personal Practice of Full Stack Development
## Medicine Database Management System
### Introduction
This project is a personal practice of full stack development. The project is a medicine database management system. The system is designed to manage the medicine information in a pharmacy.

### Versions
I created two versions of the system. The first version is a simple version. The second version is a more complex version. The second version has more features than the first version.These versions were made using Python-Flask, HTML, CSS, and JavaScript.

The current verison is made using MERN stack. The project is my first project using MERN stack. The project is a practice of full stack development.

> But First Two Python Version are now deleted from the project. You can find them in the commit history.

### Features
The system has the following features:
- CRUD operations (both front-end and back-end)
- Search for information (both front-end and back-end)
- Patients for specific medicine (both front-end and back-end)
> These features can be used for all medicine, wards, patient and patient's information.

### Folder Structure
The project has the following folder structure:
- `frontend` folder: Contains the front-end code of the project.
- `backend` folder: Contains the back-end code of the project. (Made using vite)
### Installation
To run the project, you need to install the following:
- Node.js
- npm
- MongoDB

After installing the above, you can run the project by following these steps:
1. Clone the project.
2. Go to the project directory.
> The root package.json file is just for heroku deployment of backend. So, you need to go to the backend directory to run the project locally if you want to run the project locally.

3. Run `npm install` in the backend directory.
4. Run `npm install` in the frontend directory.
5. Create a `.env` file in the backend directory and add the following:
```
MONGO_URI=your_mongo_uri
PORT=5000
API_KEY=your_app_key
```
Also, In the frontend directory, create a `.env` file and add the following:
```
VITE_BASE_URL=http://localhost:5000
VITE_API_KEY=your_app_key
```
6. Run `npm run dev` in the backend directory to run the project (You need to run the backend first).
7. Run `npm run dev` in the frontend directory to run the project (You need to run the frontend after running the backend).

## Contributing
Feel free to contribute to the project. You can contribute by:
- Reporting issues
- Suggesting new features
- Adding New features by pull request
