import { Album } from 'src/album/create-album.dto';

/**
 * @deprecated
 * Класс более не используется
 * Используйте базу
 */
export class AlbumDb {
  private albums: Album[] = [];

  constructor(private alb: Album[]) {
    this.albums = this.alb;
  }

  public get getAllAlbums(): Album[] {
    return this.albums;
  }

  public addAlbum(albums: Album) {
    this.albums.push(albums);
    return albums;
  }

  /**
   * removeAlbums
   */
  public removeAlbums(id: string) {
    const filteredAlbums = this.albums.filter((val) => val.id !== id);
    this.albums = filteredAlbums;
    return id;
  }

  /**
   * getById
   */
  public getById(id: string) {
    return this.albums.find((alb) => alb.id === id);
  }

  /**
   * updateAlbums
   */
  public updateAlbums(id: string, body: Album) {
    const mappedAlbums = this.albums.map((alb) => {
      if (alb.id === id) {
        return { ...alb, ...body };
      }
      return alb;
    });
    this.albums = mappedAlbums;
    return { body };
  }

  /**
   * Проверяет, если альбом существует
   */
  public hasAlbum(id: string) {
    return this.albums.find((val) => id === val.id);
  }
}
