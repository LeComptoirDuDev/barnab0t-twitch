import { QuestionNull } from '../src/models/Question.model';
import QL from '../src/QuestionsList';

describe('Questions basics', () => {
  it('should add question to the list', () => {
    const currentLength = QL.getListLength();
    QL.addQuestion(QuestionNull);
    expect(QL.getListLength()).toBe(currentLength + 1);
  });

  it('should return the correct question with his id', () => {
    let q = QL.addQuestion({
      author: 'John Doe',
      content: 'Lorem ipsum',
    });

    expect(QL.getQuestionById(q.id).content).toBe('Lorem ipsum');
  });

  it('should delete a question', () => {
    let q = QL.addQuestion({
      author: 'John Doe',
      content: 'Lorem ipsum',
    });

    QL.deleteQuestionById(q.id);

    expect(QL.getQuestionById(q.id)).toBe(QuestionNull);
  });

  it('should update content question', () => {
    let q = QL.addQuestion({
      author: 'John Doe',
      content: 'Lorem ipsum',
    });

    QL.updateQuestion(q.id, {
      content: 'dolor sit amet',
    });

    expect(QL.getQuestionById(q.id).content).toBe('dolor sit amet');
  });

  it('should update author question', () => {
    let q = QL.addQuestion({
      author: 'John Doe',
      content: 'Lorem ipsum',
    });

    QL.updateQuestion(q.id, {
      author: 'Alice',
    });

    expect(QL.getQuestionById(q.id).author).toBe('Alice');
  });

  it('should activate a question', () => {
    let q = QL.addQuestion({
      author: 'John Doe',
      content: 'Lorem ipsum',
    });

    QL.setActiveQuestion(q.id);

    expect(QL.getActiveQuestion()).toMatchObject(q);
  });

  it('should activate only one question', () => {
    let q1 = QL.addQuestion({});
    let q2 = QL.addQuestion({});

    QL.setActiveQuestion(q1.id);
    QL.setActiveQuestion(q2.id);

    expect(QL.getActiveQuestion()).toMatchObject(q2);
  });

  it('should get all questions', () => {
    let count = QL.getListLength();
    expect(QL.getQuestionsList().length).toBe(count);
  });

  it('should desactivate active question', () => {
    QL.setActiveQuestion(QL.DESACTIVATE_ALL);
    expect(QL.getActiveQuestion()).toBe(QuestionNull);
  });
});
