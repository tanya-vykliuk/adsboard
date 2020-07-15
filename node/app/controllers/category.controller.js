const client = require('../db');
const helper = require('../db/db_helper');


const getAllCategories = (request, response) => {
    client.query('SELECT * FROM categories WHERE deleted=0', (error, results) => {
      helper.handleError(error, response);
      response.status(200).json(results.rows);
    })
  }

  const getCategory = (request, response) => {
    const {id} = request.params;
    if(!id)return response.status(500).send('Category Id is lost.'); 
    
    client.query('SELECT * FROM categories WHERE id=$1',[id], (error, results) => {
      helper.handleError(error, response);
        if(results) return response.status(200).json(results.rows);
        return response.status(200).json({'message':'Category not found'});
    })    
  }

const deleteCategory = (request, response) => {
    const {id} = request.body;
    if(!id)return response.status(500).send('Category Id is lost.'); 
    
    client.query('UPDATE categories SET deleted=1 WHERE id=$1', [ id], (error, results) => {
        helper.handleError(error, response);
        return response.status(200).send({'message':'You succesfully deleted category.'});
    });
  }


  const saveCategory = (request, response) => {
    const {id, name} = request.body;

    let queryText = 'UPDATE categories SET name=$1 WHERE id=$2';
    let queryParams = [`${name}`, id];
    let successMessage = 'You succesfully updated category.';
    if(!id){
      queryText = 'INSERT INTO categories (name) VALUES ($1)';
      queryParams = [`${name}`];
      successMessage = 'You succesfully created category.';
    }
    
    client.query(queryText,  queryParams, (error, results) => {
      helper.handleError(error, response);
      return response.status(200).send({'message':successMessage});            
    });
    
  } 
  
  module.exports = {
    getAllCategories,
    getCategory,
    deleteCategory,
    saveCategory
  }