import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/Auth/auth.service";
import { IPost } from "../IPost";
import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
    private _postsService;
    private postsSub : Subscription | undefined;
    private authStatusSub: Subscription;

    userIsAuthenticated = false;

    constructor(postsService : PostService, private authService: AuthService){
        this._postsService = postsService;
    }

    @Input() posts: IPost[] = [];

    ngOnInit(): void
    {
        this._postsService.getPosts();
        this.postsSub = this._postsService.getPostsUpdatedListener()
        .subscribe((posts: IPost[]) => {
            this.posts = posts;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
    }

    onDelete(id: string):void{
        this._postsService.deletePost(id);
    }

    ngOnDestroy(): void {
      this.postsSub?.unsubscribe();
      this.authStatusSub.unsubscribe();
    }
}
