import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { IPost } from "../IPost";
import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
    title = '';
    content = '';

    private mode = 'create';
    private postId: string | null = null;
    post: IPost | null = null;

    constructor(private postsService: PostService, public route:ActivatedRoute){}

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                if(this.postId)
                {
                    this.postsService.getPost(this.postId).subscribe(postData => {
                        this.post = { id: postData._id, title: postData.title, content: postData.content};
                    });
                }
            } else{
                this.mode = 'create';
                this.postId = null;
            }
        })
    }

    onSubmit(form: NgForm)
    {
        if(form.invalid)
            return;
        const post: IPost = {
                id: '',
                title : form.value.title,
                content : form.value.content
        };
        if(this.mode === 'create')
        {
        this.postsService.addPost(post.title, post.content);
        }
        else
        {
            this.postsService.updatePost(this.postId as string, post.title, post.content);
        }
        form.resetForm();
    }
}
