import { Question, QuestionNull } from './models/Question.model';
import fs from 'fs';

type callbackListe = (questions: Question[]) => void;
type callbackActive = (question: Question) => void;

interface QuestionToAdd {
  author?: string;
  content?: string;
}

class QuestionsList {
  private questions: Question[] = [];
  private activeQuestion: Question = QuestionNull;
  private index: number = 0;
  public readonly DESACTIVATE_ALL = -1;
  private callbacksListeUpdate: callbackListe[] = [];
  private callbacksActiveQuestion: callbackActive[] = [];
  private PATH_TO_FILE = 'data/questions.json';

  constructor() {
    this.readQuestionsFromFile();
  }

  getListLength(): number {
    return this.questions.length;
  }

  addQuestion(question: QuestionToAdd): Question {
    const q = {
      ...question,
      id: this.index++,
    };

    this.questions.push(q);

    this.updateListe();

    return { ...q };
  }

  getQuestionById(id: number): Question {
    let q = this.questions.filter((q) => q.id === id)[0];
    return q ? { ...q } : QuestionNull;
  }

  deleteQuestionById(id: number) {
    this.questions = this.questions.filter((q) => q.id !== id);

    this.updateListe();
  }

  updateQuestion(id: number, question: QuestionToAdd) {
    let q = this.findQuestionById(id);

    this.deleteQuestionById(id);
    q = {
      ...q,
      ...question,
    };

    this.questions.push(q);

    this.updateListe();
  }

  setActiveQuestion(id: number) {
    if (id === this.DESACTIVATE_ALL) {
      this.activeQuestion = QuestionNull;
      this.updateActiveSubscribers();
      return;
    }

    this.activeQuestion = this.findQuestionById(id);
    this.updateActiveSubscribers();
    return;
  }

  getActiveQuestion(): Question {
    return this.activeQuestion !== QuestionNull
      ? { ...this.activeQuestion }
      : QuestionNull;
  }

  getQuestionsList(): Question[] {
    return this.questions.map((q) => {
      return { ...q };
    });
  }

  subscribeListUpdate(callback: callbackListe) {
    this.callbacksListeUpdate.push(callback);
  }

  subscribeActive(callback: callbackActive) {
    this.callbacksActiveQuestion.push(callback);
  }

  flush() {
    if (!fs.existsSync(this.PATH_TO_FILE)) return;
    const date = new Date();
    fs.renameSync(this.PATH_TO_FILE, this.PATH_TO_FILE+'_'+date.getTime());
    this.questions = [];
    this.updateListe();
  }

  private updateListe() {
    this.saveToFile();
    this.callbacksListeUpdate.forEach((fn) => fn(this.getQuestionsList()));
  }

  private readQuestionsFromFile() {
    try {
      if (!fs.existsSync(this.PATH_TO_FILE)) return;
      const data = fs.readFileSync(this.PATH_TO_FILE, 'utf-8');
      if (!data) return;
      this.questions = JSON.parse(data);
      this.index = this.questions.reduce((acc, question) => {
        return question.id && acc < question.id ? question.id : acc;
      }, 0) + 1;
    } catch (e) {}
  }

  private saveToFile() {
    try {
      fs.writeFile(
        this.PATH_TO_FILE,
        JSON.stringify(this.questions),
        {
          flag: 'w',
        },
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  private updateActiveSubscribers() {
    this.callbacksActiveQuestion.forEach((fn) => fn(this.getActiveQuestion()));
  }

  private findQuestionById(id: number): Question {
    return this.questions.filter((q) => q.id === id)[0] || QuestionNull;
  }
}

export default new QuestionsList();
