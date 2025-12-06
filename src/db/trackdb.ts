import { Track } from 'src/track/create-track.dto';

/**
 * @deprecated
 * Класс более не используется
 * Используйте базу
 */
export class TrackDb {
  private tracks: Track[] = [];

  constructor(private trkc: Track[]) {
    this.tracks = this.trkc;
  }

  public get getAllTracks(): Track[] {
    return this.tracks;
  }

  public addTrack(track: Track) {
    this.tracks.push(track);
    return track;
  }

  /**
   * removeTrack
   */
  public removeTrack(id: string) {
    const filteredTrack = this.tracks.filter((val) => val.id !== id);
    this.tracks = filteredTrack;
    return id;
  }

  /**
   * getById
   */
  public getById(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  /**
   * updateTrack
   */
  public updateTrack(id: string, body: Track) {
    const mappedTrack = this.tracks.map((track) => {
      if (track.id === id) {
        return { ...track, ...body };
      }
      return track;
    });
    this.tracks = mappedTrack;
    return { body };
  }

  /**
   * Проверяет, если трек существует
   */
  public hasTrack(id: string) {
    return this.tracks.find((val) => id === val.id);
  }
}
