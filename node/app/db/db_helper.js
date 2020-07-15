function handleError(error, error_response){
    if (error)  return error_response.status(500).send('Error DB : '+error.message);
  }
  
  module.exports = {      
      handleError
}