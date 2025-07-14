import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-header",
	imports: [RouterModule, CommonModule],
	templateUrl: "./header.component.html",
})
export class HeaderComponent {
	@Input() currentRoute = "";
}
