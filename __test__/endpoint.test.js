const request = require('supertest');
const app = require('../app');
const { writeDB, readDB } = require('../server/services/dbHelpers');

jest.mock('../server/services/dbHelpers'); // Mock the dbHelpers module

describe('Todos API', () => {
  beforeEach(() => {
    // Reset the mock data
    readDB.mockClear(); 
    writeDB.mockClear(); 
  });

  // GET test
  it('should fetch all todos', async () => {
    readDB.mockImplementation(() => [{ id: 1, task: 'Test Todo' }]); 

    const response = await request(app).get('/api/todos');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, task: 'Test Todo' }]);
  });

  // POST test
  it('should add a new todo', async () => {
    const newTodo = { id: 2, task: 'New Todo' };

    writeDB.mockImplementation((todos) => todos);

    const response = await request(app).post('/api/todos').send(newTodo);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(newTodo);
    expect(writeDB).toHaveBeenCalledWith(expect.arrayContaining([newTodo])); 
  });

  // PUT test
  it('should update an existing todo', async () => {
    const todos = [{ id: 1, task: 'Old Todo' }];
    readDB.mockImplementation(() => todos);
    const updatedTodo = { id: 1, task: 'Updated Todo' };

    writeDB.mockImplementation((updatedTodos) => updatedTodos);

    const response = await request(app).put('/api/todos/1').send(updatedTodo);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedTodo);
    expect(writeDB).toHaveBeenCalledWith(expect.arrayContaining([updatedTodo]));
  });

  // Error check
  it('should return 404 for a non-existing todo', async () => {
    readDB.mockImplementation(() => [{ id: 1, task: 'Existing Todo' }]);

    const response = await request(app).put('/api/todos/999').send({ id: 999, task: 'Non-existent Todo' });
    
    expect(response.status).toBe(404);
    expect(response.text).toBe('Todo not found');
  });
});
