import { Component, OnInit } from '@angular/core';
import { AdminService } from '@services/admin/admin.service';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-videogames-premium',
    templateUrl: './videogames-premium.component.html',
    styleUrls: ['./videogames-premium.component.sass']
})
export class VideogamesPremiumComponent implements OnInit {

    public data;
    public categoryType;
    public userId: string;
    public categories: string [];
    public name: string;
    public outDate: string;
    public publicDirected: string;
    public sinopsis: string;
    public image: string;
    public marks: any;
    public gameId: string;
    public duration: string;

    constructor(
        private adminService: AdminService,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<any>
    ) {
        this.getStore();
    }

    ngOnInit() {
        this.detectedChangeRoute();
        this.initializeData();
    }

    detectedChangeRoute(): void {
        this.router.events.forEach((event) => {
            if (event instanceof NavigationEnd) {
                this.initializeData();
            }
        });
    }

    initializeData() {
        this.categoryType = this.route.snapshot.paramMap.get('type');
        if (this.categoryType) {
            this.getCategoriesGame(this.categoryType);
        } else {
            this.getAllGames();
        }
    }

    getAllGames() {
        const self = this;

        this.adminService.getAllGames()
            .pipe(
                map(response => {
                    console.log(response);
                    return response['games'];
                })
            )
            .subscribe(response => {
                this.data = response;
            });
    }

    getCategoriesGame(type) {
        this.adminService.getGamesForType('category_games', type)
            .pipe(
                map(data => data['Games'])
            )
            .subscribe(response => {
                console.log(response);
                this.data = response;
            });
    }

    getStore() {
        const self = this;

        self.store.pipe(
          map(value => {
            return value.state['userData'];
          })
        )
        .subscribe(response => {
           self.userId = response.sub;
        });
    }

    takeInformation(game) {
        console.log(game);

        this.name = game.name;
        this.categories = game.categories.join(',');
        this.outDate = game.out_date;
        this.publicDirected = game.public_directed;
        this.duration = game.duration;
        this.sinopsis = game.sinopsis;
        this.image = game.image;
        this.marks = game.marks;
        this.gameId = game.id;
    }

}
