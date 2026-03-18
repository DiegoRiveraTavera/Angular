import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[ifHasPermission]',
  standalone: true
})
export class HasPermissionDirective {

  private permisos: string[] = [];

  constructor(
    private permissionsSvc: PermissionsService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set ifHasPermission(value: string[] | string) {

    this.permisos = Array.isArray(value) ? value : [value];

    if (this.permissionsSvc.hasAnyPermission(this.permisos)) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }

  }
}
  
 /*import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject, signal } from '@angular/core';
import { Permission, PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly permissionsService = inject(PermissionsService);

  private readonly requiredPermissions = signal<readonly Permission[]>([]);
  private readonly mode = signal<'any' | 'all'>('any');
  private hasEmbeddedView = false;

  constructor() {
    effect(() => {
      this.permissionsService.activePermissions();
      const permissions = this.requiredPermissions();
      const currentMode = this.mode();
      const allowed =
        currentMode === 'all'
          ? this.permissionsService.hasAllPermissions(permissions)
          : this.permissionsService.hasAnyPermissions(permissions);

      if (allowed && !this.hasEmbeddedView) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        this.hasEmbeddedView = true;
        return;
      }

      if (!allowed && this.hasEmbeddedView) {
        this.viewContainerRef.clear();
        this.hasEmbeddedView = false;
      }
    });
  }

  @Input({ required: true })
  set appHasPermission(value: Permission | readonly Permission[]) {
    const normalizedValue = Array.isArray(value) ? value : [value];
    this.requiredPermissions.set(normalizedValue.filter(Boolean));
  }

  @Input()
  set appHasPermissionMode(value: 'any' | 'all') {
    this.mode.set(value === 'all' ? 'all' : 'any');
  }
}
  */