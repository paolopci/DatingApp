import { Routes, CanActivateFn } from '@angular/router';
import { Home } from './home/home';
import { MemberList } from './members/member-list/member-list';
import { MemberDetail } from './members/member-detail/member-detail';
import { Lists } from './lists/lists';
import { Messages } from './messages/messages';
import { authGuard } from './_guards/auth-guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: '', runGuardsAndResolvers: 'always',
        canActivate: [authGuard], // Apply the authGuard to all child routes
        children: [
            { path: 'members', component: MemberList },
            { path: 'members/:username', component: MemberDetail },
            { path: 'member/edit', component: MemberEditComponent },
            { path: 'lists', component: Lists },
            { path: 'messages', component: Messages },
        ]
    },
    { path: 'errors', component: TestErrorsComponent }, // Route for testing errors
    { path: 'not-found', component: NotFoundComponent }, // Route for testing not-found error
    { path: 'server-error', component: ServerErrorComponent }, // Route for testing errors
    { path: '**', component: Home, pathMatch: 'full' } // Wildcard route for a 404 page,

];
