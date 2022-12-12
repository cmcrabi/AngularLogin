import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { map, Observable, Subject } from 'rxjs';
import { IPost } from './IPost';

@Injectable({
    providedIn : 'root'
})

export class PostService {
    private posts:IPost[] = [];
    private postsUpdated = new Subject<IPost[]>();
    constructor(private http:HttpClient){}

    getPosts()
    {
        this.http.get<{message: String, posts: any[]}>('http://localhost:3000/api/posts')
        .pipe(map((postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe(mappedPosts => {
            this.posts = mappedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostsUpdatedListener()
    {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string){
        const post: IPost = {id: '', title: title, content: content};
        this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
        .subscribe(responseData => {
            //update the post recently created so that it can be deleted also immediately. else id will have empty value and that post cannot be deleted.
            const id = responseData.postId;
            post.id = id;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPost(id: string)
    {
        //return {...this.posts.find(p => p.id === id)};
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
    }

    updatePost(id: string, title: string, content: string)
    {
        const post: IPost = {id: id, title: title, content: content};
        this.http.put('http://localhost:3000/api/posts/' + id, post)
        .subscribe(response => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(x=>x.id === post.id);
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });

    }

    deletePost(postId: string){
        this.http.delete('http://localhost:3000/api/posts/' + postId)
        .subscribe(()=>{
            const updatedPosts = this.posts.filter(post=>post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            console.log('Deleted');
        })
    }
}