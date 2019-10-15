const express = require('express');

const api = express();

api.use(express.json());

const projects = [
  {
  id : "1",
  title : "Novo projeto 1",
  tasks: []
  },
  {
    id : "2",
    title : "Novo projeto 2",
    tasks: []
  }
];

var numReq = 0;

api.use((request, response, next) => {
  
  numReq += 1;
  console.log("Requisições já realizadas : " +numReq);

  return next();
})

function checkProjectExists(request,response,next) {

  const { id } = request.params;
  
  const project = projects.find( project => project.id === id);

  if(!project) {
    return response.json({ error : "Project does not exists!"});
  }

  return next();
}

api.post('/projects', (request, response) => {
  const { id } = request.body;
  const { title } = request.body;

  projects.push({
    id : id,
    title : title,
    tasks : []
  });

  return response.json(projects);
});

api.get('/projects', (request, response) => {
  if (!projects) {
    return response.json({ error : 'There is no tasks in the list!'});
  }

  return response.json(projects);
});

api.put('/projects/:id',checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const project = projects.find( project => project.id === id);
  const index = projects.indexOf(project);

  project.title = title;

  projects[index] = project;

  response.json(projects);
});

api.delete('/projects/:id',checkProjectExists, (request, response) => {
  
  const { id } = request.params;

  const project = projects.find( project => project.id === id);

  const index = projects.indexOf(project);

  projects.splice(index,1);

  return response.send();
});

api.post('/projects/:id/tasks',checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  const project = projects.find( project => project.id === id);
  const index = projects.indexOf(project);

  project.tasks.push(title);

  projects[index] = project;

  return response.json(projects);
});

api.listen(3333);