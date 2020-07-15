const client = require('../db');
const helper = require('../db/db_helper');
const nodemailer = require("nodemailer");

const CountWaitingAdvertisements = (request, response) => {
  client.query('SELECT COUNT(id) FROM advertisements WHERE status=$1',['created'] ,(error, results) => {
    helper.handleError(error, response);
    return response.status(200).json(results.rows[0].count)
  })
}

const getAllAds = (request, response) => {
  client.query('SELECT a.*, c.name as category_name FROM advertisements as a '+
  'LEFT JOIN categories as c ON c.id=a.category_id'+
  ' WHERE a.published=true AND a.status=\'approved\'', (error, results) => {
    helper.handleError(error, response);
    response.status(200).json(results.rows)
  })
}

const getAdvById = (request, response) => {
    const id = parseInt(request.params.id);    
    if(!id) response.status(500).send('Advertisement Id is lost.');
    client.query('SELECT a.*, c.name as category_name, u.name as user_name, u.email as user_email '+
    'FROM advertisements as a JOIN categories as c ON c.id=a.category_id '+
    'JOIN users as u ON u.id=a.author_id WHERE a.id = $1', [id], (error, results) => { 
      helper.handleError(error, response);
      const res = results ? results.rows : {'message':'Cant\'t find advertisement'};
      return response.status(200).json(res)          
    });   
    
  }


const getAllForUser = (request, response) => {
  const {id} = request.query;
  if(!id) return response.status(500).send('User Id is lost.');

    client.query('SELECT a.*, c.name as category_name FROM advertisements as a '+
    'LEFT JOIN categories as c ON c.id=a.category_id '+
    'WHERE a.status<>\'deleted\' AND a.author_id=$1 ORDER BY a.id desc', 
    [id], (error, results) => {
      helper.handleError(error, response);
      return response.status(200).json(results.rows);
    })
}

const getAllForManager = (request, response) => {
  client.query('SELECT a.*, c.name as category_name, u.name, u.email '+
  'FROM advertisements as a JOIN categories as c ON c.id=a.category_id '+
  'JOIN users as u ON u.id=a.author_id '+
  'WHERE a.status=\'created\' ORDER BY a.id asc', (error, results) => {
    helper.handleError(error, response);
    return response.status(200).json(results.rows);
  })
}


const createAdvertisement = (request, response) => {
  const {id, title, description, published, category_id, short_description, author_id} = request.body;
  if(id){
    client.query('SELECT title, short_description, description FROM advertisements WHERE id=$1', 
    [id], (error, results) => {
      helper.handleError(error, response);
      old_version = results.rows[0];
      
      let querytext = 'UPDATE advertisements SET title=$1, short_description=$2, description=$3, published=$4,'
      +' category_id=$5, status=$6, last_modify_date=$7 WHERE id=$8';

      let values = [`${title}`,`${short_description}`,`${description}`, published, category_id,'created','NOW()',id];

      if(title === old_version.title && short_description === old_version.short_description && description === old_version.description){
        querytext = 'UPDATE advertisements SET title=$1, short_description=$2, description=$3, '
        +'published=$4, category_id=$5, last_modify_date=$6 WHERE id=$7';
        values = [`${title}`,`${short_description}`,`${description}`, published, category_id,'NOW()',id];
      }
          client.query(querytext,values, (error, results) => {
            helper.handleError(error, response);
            return response.status(200).send({'message':'You succesfully update advertisement.'});                      
        });
    })
    
  }else{
    client.query('INSERT INTO advertisements (title,short_description, description,published,author_id,category_id,status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [`${title}`,`${short_description}`,`${description}`, published, author_id, category_id,'created'], (error, results) => {
        helper.handleError(error, response);
        if ( results.rowCount === 1) {
            return response.status(200).send({'message':'You succesfully create advertisement. After approving by manager it will shown on site.'});                      
        }
    });
  } 
}

const approveAdvertisement = (request, response) => {
  const {id, reviewerId} = request.body;
  if(!id) return response.status(500).send('Advertisement Id is lost.');
  client.query('UPDATE advertisements SET status=$1, reviewer_id=$2 WHERE id=$3',
    ['approved', reviewerId, id], (error, results) => {
      helper.handleError(error, response);
      if ( results.rowCount == 1) {
        client.query('SELECT u.email FROM users as u JOIN advertisements as a ON a.author_id=u.id WHERE a.id=$1', [id], (error, results) => {
          helper.handleError(error, response);
          if(results.rows){
            let email = results.rows[0].email;
            let sent = sendApprovedEmailToUser(email, id );
              if(sent.error == 1){
                  return response.status(200).send({'message':'You succesfully approved advertisement','errorEmail':sent.message,'error':error});
              }else{
                return response.status(200).send({'message':'You succesfully approved advertisement.'+sent.message});
              }   
          }
        });                        
      }
  });
 
}

function sendApprovedEmailToUser(email, id){
  res = {error:0, message:''};    
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: "tanya.vykliuk@gmail.com",
          pass: "Dtyzysydem08"
      }
    });
    
    var mailOptions = {
      from: 'tanya.vykliuk@gmail.com',
      to: email,
      subject: 'Approved advertisement',
      html: '<h1>Hi from Advertisements Board!</h1>'
      +'<p>Manager approved your advertisement number '+id+'. Now it shown for everyone. Come and check it.</p>'
      +'<a href=\"http://localhost:4200/" style=\"cursor:pointer;\">Go to Advertisement Board</a>'

    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        res.error = 1;
        res.message = error;
      } else {
          res.message =info.response;         
      }
    });

    return res;
  }

  const rejectAdvertisement = (request, response) => {
    const {id, reason, reviewerId} = request.body;
    if(!id) return response.status(500).send('Advertisement Id is lost.');
    client.query('UPDATE advertisements SET status=$1, reviewer_id=$2 WHERE id=$3',
      ['rejected', reviewerId, id], (error, results) => {
        helper.handleError(error, response);
        if ( results.rowCount == 1) {
          client.query('SELECT u.email FROM users as u JOIN advertisements as a ON a.author_id=u.id WHERE a.id=$1', [id], (error, results) => {
            helper.handleError(error, response);
            if(results.rows){
              let email = results.rows[0].email;
              let sent = sendRejectionEmailToUser(email, reason, id);
                if(sent.error == 1){
                    return response.status(200).send({'message':'You reject advertisement','errorEmail':sent.message,'error':error});
                }else{
                  return response.status(200).send({'message':'You reject advertisement.'+sent.message});
                }   
            }
          });                        
        }
    });
  }

  function sendRejectionEmailToUser(email, reason, id){
    res = {error:0, message:''};    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "tanya.vykliuk@gmail.com",
            pass: "Dtyzysydem08"
        }
      });
      
      var mailOptions = {
        from: 'tanya.vykliuk@gmail.com',
        to: email,
        subject: 'Rejected advertisement',
        html: '<h1>Hi from Advertisements Board!</h1>'
        +'<p>Manager rejected your advertisement number '+id+' with comment <br /> '+reason+'. <br />Come and check it.</p>'
        +'<a href=\"http://localhost:4200/" style=\"cursor:pointer;\">Go to Advertisement Board</a>'
  
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.error = 1;
          res.message = error;
        } else {
            res.message =info.response;         
        }
      });
  
      return res;
    }

  const publishAdvertisement = (request, response) => {
    const {id, flag} = request.body;
    if(!id) return response.status(500).send('Advertisement Id is lost.');
    updFlag = true;
    if(flag === 0){updFlag=false;}
    client.query('UPDATE advertisements SET published=$1 WHERE id=$2',
      [updFlag, id], (error, results) => {
        helper.handleError(error, response);
        return response.status(200).send({'message':'You succesfully updated advertisement.'});                      
    }); 
}

const deleteAdvertisement = (request, response) => {
  const {id} = request.body;
  if(!id) return response.status(500).send('Advertisement Id is lost.'); 
  
  client.query('UPDATE advertisements SET status=$1 WHERE id=$2',
    ['deleted', id], (error, results) => {
      helper.handleError(error, response);
      if ( results.rowCount == 1) {
          return response.status(200).send({'message':'You succesfully deleted advertisement.'});                      
      }
  });
  
}


module.exports = {
    CountWaitingAdvertisements,
    getAllAds,
    getAdvById,
    getAllForUser,
    getAllForManager,    
    createAdvertisement,
    approveAdvertisement,
    publishAdvertisement,
    deleteAdvertisement,
    rejectAdvertisement
}