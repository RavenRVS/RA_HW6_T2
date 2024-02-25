import './Notes.css';
import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NotesCard from '../NotesCard/NotesCard';

/**
 * Интерфейс для представления заметки
 * @interface NoteInterface
 * @property {string} id - уникальный идентификатор заметки
 * @property {string} text - текст заметки
 */
interface NoteInterface {
  id: string,
  text: string,
}

/**
 * Интерфейс для представления состояния компонента Notes
 * @interface NotesState
 * @property {NoteInterface[]} notes - массив заметок
 * @property {string} cardText - текст новой заметки
 * @property {boolean} isLoading - флаг, указывающий, загружаются ли заметки
 */
interface NotesState {
  notes: NoteInterface[],
  cardText: string,
  isLoading: boolean,
}

// URL для получения и отправки заметок
const notesUrl = process.env.REACT_APP_NOTES_URL;

/**
 * Классовый компонент для отображения и управления заметками
 * @class Notes
 * @extends {Component<{}, NotesState>}
 */
class Notes extends Component<{}, NotesState> {

  // Инициализация состояния компонента
  state: NotesState = {
    notes: [],
    cardText: '',
    isLoading: false,
  };

  /**
   * Жизненный цикл компонента, вызывается после монтирования компонента в DOM
   * @method componentDidMount
   * @async
   */
  async componentDidMount() {
    await this.loadNotes();
  }

  /**
   * Метод для выполнения фетч запроса с заданными параметрами
   * @method fetchRequest
   * @async
   * @param {string | undefined} url - URL для запроса
   * @param {string} method - метод запроса (GET, POST, DELETE и т.д.)
   * @param {any} headers - заголовки запроса
   * @param {any} body - тело запроса
   * @returns {Promise<Response | undefined>} - промис с ответом или undefined в случае ошибки
   */
  async fetchRequest(url: string | undefined, method: string, headers: any, body: any) {
    try {
      if (!url) { throw new Error('URL is not defined'); }

      // Создаем пустой объект для опций запроса
      const options: any = {};

      if (method) { options.method = method; }
      if (body) { options.body = body; }
      if (headers != null) { options.headers = headers; }

      const response = await fetch(url, options);
      if (!response.ok) { throw new Error('HTTP Error ' + response.status); }

      return response;
    } catch (error) { console.error(error); }
  }

  /**
   * Метод для загрузки заметок с сервера
   * @method loadNotes
   * @async
   */
  async loadNotes() {
    try {
      const response = await this.fetchRequest(notesUrl, 'GET', null, null);
      if (!response) return;

      const notes = await response.json();
      this.setState({ notes: notes.notes, isLoading: true });

    } catch (error) {
      console.error('Ошибка при загрузке заметок:', error);
      this.setState({ isLoading: false });
    }
  };

  /**
   * Метод для добавления новой заметки на сервер
   * @method addNote
   * @async
   */
  async addNote() {
    const { cardText } = this.state;

    const newNote: NoteInterface = {
      id: uuidv4(),
      text: cardText,
    };

    this.setState({ cardText: '' })

    await this.fetchRequest(notesUrl, 'POST', {
      'Content-Type': 'application/json',
    }, JSON.stringify(newNote));

    await this.loadNotes();
  }

  /**
   * Метод для удаления заметки с сервера по id
   * @method removeNote
   * @async
   * @param {string} id - идентификатор заметки
   */
  async removeNote(id: string) {
    await this.fetchRequest(`${notesUrl}/${id}`, 'DELETE', null, null);
    await this.loadNotes();
  };

  /**
   * Метод для обновления заметок с сервера
   * @method refreshNotes
   * @async
   */
  async refreshNotes() {
    await this.loadNotes();
  }

  /**
   * Метод для рендеринга компонента
   * @method render
   * @returns {JSX.Element} - JSX элемент для отображения компонента
   */
  render(): JSX.Element {
    const { notes, isLoading, cardText } = this.state;
    return (
      <div className='container'>

        {!isLoading ? (
          <div className="loading-animation"></div>
        ) : (
          <div className="notes-container">
            <div className="notes-header">
              <div className="notes-header__name">Notes</div>
              <div className="notes-header__btn notes-btn" onClick={this.refreshNotes.bind(this)}></div>
            </div>

            <div className="notes-cards">
              {notes.map((note) => (
                <NotesCard
                  key={note.id}
                  note={note}
                  onDelete={() => this.removeNote(note.id)}
                />
              ))}
            </div>

            <div className="notes-form">
              <p className="notes-from-name">New Note</p>
              <textarea
                className="notes-form__text"
                value={cardText}
                onChange={(e) => this.setState({ cardText: e.target.value })}
              />
              <div
                className="notes-form__btn notes-btn"
                onClick={() => this.addNote()}
              ></div>
            </div>
          </div>

        )}
      </div>
    )
  }
}

export default Notes;