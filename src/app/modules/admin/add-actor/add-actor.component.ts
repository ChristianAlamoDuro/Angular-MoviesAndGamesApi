import { Component, OnInit } from '@angular/core';
import { map, finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '@services/admin/admin.service';
import { DataAplicationService } from '@services/data-aplication/data-aplication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-add-actor',
    templateUrl: './add-actor.component.html',
    styleUrls: ['./add-actor.component.sass']
})
export class AddActorComponent implements OnInit {

    public title: string;
    public userId: string;
    public formGroup: FormGroup;
    public actorId: string;
    public name: string;
    public surname: string;
    public birthday: string;
    public biography: string;
    public actorImage: any;
    public load = false;

    constructor(
        private store: Store<any>,
        private formBuilder: FormBuilder,
        private adminService: AdminService,
        private dataService: DataAplicationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.title = 'Add actor';
        this.takeParamsUrl();
    }

    ngOnInit() {
        this.getStore();
    }

    takeParamsUrl() {
        this.actorId = this.route.snapshot.paramMap.get('id');

        if (this.actorId) {
            this.title = 'Modify Actor';
            this.adminService.getActor(this.actorId)
                .pipe(
                    finalize(() => {
                        this.createForm();
                    })
                )
                .subscribe(response => {
                    this.name = response[0].name;
                    this.surname = response[0].surname;
                    this.biography = response[0].biography;
                    this.birthday = response[0].birthday;
                    this.load = true;
                });
        } else {
            this.createForm();
            this.load = true;
        }

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

    createForm() {
        this.formGroup = this.formBuilder.group({
            actorName: [
                this.name,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^[a-zA-ZZÁÉÍÓÚ]+(([ ][a-zA-ZÁÉÍÓÚáéíúóÑñ ])?[a-zA-ZÁÉÍÓÚáéíúóÑñ]*)*$')
                ])
            ],
            actorSurname: [
                this.surname,
                Validators.compose([
                    Validators.required,
                    Validators.pattern('^[a-zA-ZZÁÉÍÓÚ]+(([ ][a-zA-ZÁÉÍÓÚáéíúóÑñ ])?[a-zA-ZÁÉÍÓÚáéíúóÑñ]*)*$')
                ])
            ],
            actorBirthday: [
                this.birthday,
                Validators.pattern('^[0-3]{1}[0-9]{1}/[0-1]{1}[0-9]{1}/[12]{1}[0-9]{3}$')
            ],
            biography: [
                this.biography,
                Validators.compose([Validators.required, Validators.maxLength(255)])
            ],
            image: [
                this.actorImage,
                Validators.required
            ]
        });
    }

    takeImage(image) {
        this.actorImage = image;
    }

    onSubmit(formActor) {
        let data: any;
        data = {
            name: formActor.value.actorName,
            surname: formActor.value.actorSurname,
            birthday: formActor.value.actorBirthday,
            biography: formActor.value.biography,
            image: formActor.value.image,
            user_id: this.userId
        };

        if (this.actorId) {
            data = {
                ...data,
                id: this.actorId
            };
        }

        this.adminService.addActor(data, this.actorImage[0]).
            subscribe(response => {
                console.log(response);

                this.dataService.createModal('success', 'Successfull', 'Actor have been saved');
                this.router.navigate(['/adminShow/actors']);
                this.formGroup.reset();
            });
    }

}
