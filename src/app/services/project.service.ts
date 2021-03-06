import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { ProjectListAPI } from '../classes/project-list-api';
import { Project } from '../classes/project';
import { TaskListAPI } from '../classes/task-list-api';
import { Task } from '../classes/task';
import { NewTask } from '../classes/new-task';
import { NewProject } from '../classes/new-project';
import { ProjectAvatar } from '../classes/project-avatar';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private path:String;

   constructor(private http:HttpClient) {

      /* get Rest-api service 'path' */
      this.path=RestApiService.getPath();
   }

   /* to handle error */
  private handleError(error: HttpErrorResponse) 
  {
     
    if (error.error instanceof ErrorEvent) {
      /* A client-side or network error occurred. */

      console.error('An error occurred:', error.error.message);
      return throwError('client side Error: '+error.error.message);
    } 
    else 
    {
      console.error(
        `Backend returned code: ${error.status}, ` +
        `body was:${error.error.detail},`+
        
        `message was: ${error.message}` );
        
        alert(error.error.detail);
        return throwError(error.error.detail);
        
  }};


   async get_projects(page_no:number):Promise<Project[]>
  {
    let response:HttpResponse<ProjectListAPI>;
   
      response=await this.http.get<ProjectListAPI>(this.path+'api/projects/?page='+page_no,
            {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
            .pipe(catchError(this.handleError)).toPromise();

      let projectListApi:ProjectListAPI=response.body;

      return projectListApi.results;
          
  }


  /* get individual project details */
  async get_project_by_id(project_id:number):Promise<Project>
  {
    let response:HttpResponse<Project>;
    /* get token */
      response=await this.http.get<Project>(this.path+'api/projects/'+project_id+'/',
            {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
            .pipe(catchError(this.handleError)).toPromise();

      let project:Project=response.body;

      return project;
          
  }


  //delete project by id (only manager can delete project)
  delete_project_by_id(project_id:number)
  {
    return this.http.delete(this.path+'api/projects/'+project_id+'/delete/',
      {headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe:'response'}).pipe(catchError(this.handleError))
  } 


  //update project by id
  update_project_by_id(project:Project)
  {
    return this.http.put<Project>(this.path+'api/projects/'+project.id+'/update/',project,
            {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
            .pipe(catchError(this.handleError))
  }

  //retrieve task for a particular project
  async get_tasks(project_id:number,page_no:number):Promise<Task[]>
  {
    let response:HttpResponse<TaskListAPI>;
    
      response=await this.http.get<TaskListAPI>(this.path+'api/projects/'+project_id+'/tasks/?page='+page_no,
            {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
            .pipe(catchError(this.handleError)).toPromise();

      let taskListApi:TaskListAPI=response.body;

      return taskListApi.results;
          
  }

  /* get individual task details (of a project) */
  async get_task_by_id(project_id:number,task_id:number):Promise<Task>
  {
    let response:HttpResponse<Task>;
    /* get token */
      response=await this.http.get<Task>(this.path+'api/projects/'+project_id+'/tasks/'+task_id+'/',
            {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
            .pipe(catchError(this.handleError)).toPromise();

      let task:Task=response.body;

      return task;
          
  }

  //update task by id (with project_id)
  update_task_by_id(project_id:number,new_task:NewTask)
  {
    return this.http.put<Task>(this.path+'api/projects/'+project_id+'/tasks/'+new_task.id+'/update/',new_task,
            {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
            .pipe(catchError(this.handleError))
  }

    //delete task by id (only manager can delete project's task)
    delete_task_by_id(project_id:number,task_id:number)
    {
      return this.http.delete(this.path+'api/projects/'+project_id+'/tasks/'+task_id+'/delete/',
        {headers: new HttpHeaders({'Content-Type': 'application/json'}),
        observe:'response'}).pipe(catchError(this.handleError))
    } 

    //create new project (only authenticated users)
    create_new_project(new_project:NewProject)
    {

      return this.http.post<NewProject>(this.path+'api/projects/create/',new_project,
            {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
            .pipe(catchError(this.handleError))

    }

    create_new_task(project_id:number,new_task:NewTask)
    {

      return this.http.post<NewTask>(this.path+'api/projects/'+project_id+'/tasks/create/',new_task,
      {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
      .pipe(catchError(this.handleError))
    }


    //get project avatar image
    async get_project_avatar(project_id:number):Promise<ProjectAvatar>
    {

      let response:HttpResponse<ProjectAvatar>=await this.http.get<ProjectAvatar>(this.path+'api/projects/'+project_id+'/image/',
      {headers: new HttpHeaders({'Content-Type': 'application/json'}),observe:'response'})
      .pipe(catchError(this.handleError)).toPromise();

      return response.body;


    }

    /* update project image by user --->change contentType to match as below */
     updateProjectAvatar(project_id:number,formData:FormData,filename:string)
     {

      return  this.http.post<any>(this.path+'api/projects/'+project_id+'/image/'+filename+'/',formData).pipe(
        catchError(this.handleError)
    );

    }

}
