import { Artist } from 'src/artist/create-artist.dto';

/**
 * @deprecated
 * Класс более не используется
 * Используйте базу
 */
export class ArtistDb {
  private artists: Artist[] = [];

  constructor(private art: Artist[]) {
    this.artists = this.art;
  }

  public get getAllArtist(): Artist[] {
    return this.artists;
  }

  public addArtist(artist: Artist) {
    this.artists.push(artist);
    return artist;
  }

  /**
   * removeArtist
   */
  public removeArtist(id: string) {
    const filteredArtist = this.artists.filter((val) => val.id !== id);
    this.artists = filteredArtist;
    return id;
  }

  /**
   * getById
   */
  public getById(id: string) {
    return this.artists.find((art) => art.id === id);
  }

  /**
   * updateArtist
   */
  public updateArtist(id: string, body: Artist) {
    const mappedArtist = this.artists.map((art) => {
      if (art.id === id) {
        return { ...art, ...body };
      }
      return art;
    });
    this.artists = mappedArtist;
    return { body };
  }

  /**
   * Проверяет, если исполнитель существует
   */
  public hasArtist(id: string) {
    return this.artists.find((val) => id === val.id);
  }
}
