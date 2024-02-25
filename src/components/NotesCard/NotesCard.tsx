import './NotesCard.css';
import React, { Component } from 'react';

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
 * Интерфейс для представления свойств компонента NotesCard
 * @interface NoteProps
 * @property {NoteInterface} note - заметка для отображения
 * @property {() => void} onDelete - функция для удаления заметки
 */
interface NoteProps {
  note: NoteInterface,
  onDelete: () => void,
}

/**
 * Классовый компонент для отображения одной заметки
 * @class NotesCard
 * @extends {Component<NoteProps>}
 */
class NotesCard extends Component<NoteProps> {

  /**
   * Метод для рендеринга компонента
   * @method render
   * @returns {JSX.Element} - JSX элемент для отображения компонента
   */
  render(): JSX.Element {
    const { note, onDelete } = this.props;

    return(
      <div className="notes-card">
        <div className="notes-card__btn notes-btn" onClick={onDelete}></div>
        <p className="notes-card__text">{note.text}</p>
      </div>
    );
  }
}

export default NotesCard;