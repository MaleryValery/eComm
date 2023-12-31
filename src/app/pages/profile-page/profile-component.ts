import RouteComponent from '../../shared/view/route-component';
import ReadonlyProfileComponent from './readonly-profile/readonly-profile-component';
import WritableProfileComponent from './writable-profile/writeble-profile-component';

export default class ProfileComponent extends RouteComponent {
  private profileRead = new ReadonlyProfileComponent(this.emitter, this.path);
  private profileWrite = new WritableProfileComponent(this.emitter, this.path);

  private curProfile: ReadonlyProfileComponent | WritableProfileComponent = this.profileRead;

  public render(parent: HTMLElement): void {
    this.isRendered = true;
    this.parent = parent;

    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    this.emitter.subscribe('changeProfile', (route: string) => {
      this.onChangeProfile(route);
    });

    this.emitter.subscribe('hashchange', (hash: string) => {
      if (hash !== `#${this.path}` && this.curProfile !== this.profileRead) {
        this.hide();
        this.curProfile.clearProfile();
        this.curProfile = this.profileRead;
      }
    });

    this.emitter.subscribe('updateProfile', () => {
      this.hide();
      this.profileRead.clearProfile();
      this.profileWrite.clearProfile();
      this.curProfile = this.profileRead;
      this.show();
    });
  }

  private onChangeProfile(route: string): void {
    this.hide();
    if (route === 'toProfileRead') {
      this.curProfile.clearProfile();
      this.curProfile = this.profileRead;
    }
    if (route === 'toProfileWrite') this.curProfile = this.profileWrite;
    this.show();
  }

  public show(): void {
    if (!this.curProfile.isRendered) this.curProfile.render(this.parent);
    this.curProfile.show();
  }

  public hide(): void {
    this.curProfile.hide();
  }
}
