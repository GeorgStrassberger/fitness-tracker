import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  imports: [BrowserAnimationsModule, MatButtonModule, MatIconModule],
  exports: [BrowserAnimationsModule, MatButtonModule, MatIconModule],
})
export class MaterialModule {}
