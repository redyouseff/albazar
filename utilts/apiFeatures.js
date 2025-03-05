

class apiFeatures{

    constructor (queryStringObject,mongooseQuery){
        this.queryStringObject=queryStringObject;
        this.mongooseQuery=mongooseQuery;
    }

    filter(){
        let quearyStr={...this.queryStringObject};
        const excludesFields=["page","limit","sort","fields"]
        excludesFields.forEach((field)=>delete quearyStr[field]);
        let quearyString=JSON.stringify(quearyStr);
     
        quearyString = quearyString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.mongooseQuery=this.mongooseQuery.find(JSON.parse(quearyString))
      
      
        return this

    }

    sort(){
        
        if(this.queryStringObject?.sort){
            const sort=this.queryStringObject.sort.split(",").join(" ");
         
            this.mongooseQuery=this.mongooseQuery.sort(sort);

        }
        return this;
    
    }

    limitFields(){
        if(this.queryStringObject.fields){
            const field=this.queryStringObject.fields.split(",").join(" ")
            this.mongooseQuery=this.mongooseQuery.select(field)
        }
        return this
    }

    search(modelName){
        if(this.queryStringObject.keyword){
            if(modelName=="product"){
            let query ={};
            query.$or = [
                { title: { $regex: this.queryStringObject.keyword, $options: 'i' } },
                { description: { $regex: this.queryStringObject.keyword, $options: 'i' } },
              ];
            this.mongooseQuery=this.mongooseQuery.find(query)
        }
        else{
            query= { name: { $regex: this.queryStringObject.keyword, $options: 'i' } }
        }
        }
        return this ;
    }


    paginate(countDocuments){
     

        const page=this.queryStringObject.page*1 || 1 ;
        const limit=this.queryStringObject.limit*1 || 5;
        const skip=(page-1)*limit
        const endIndex=page*limit
        let pagination={};
        pagination.currentPage=page
        pagination.limit=limit;
        pagination.numbeOfPage=Math.ceil(countDocuments / limit);
        if(endIndex<countDocuments){
            pagination.next=(page+1);
        }
        if(skip>0){
            pagination.prev=(page-1)
        }


        this.paginationRedult=pagination;
       
        this.mongooseQuery=this.mongooseQuery.skip(skip).limit(limit)
      


        return this

    }
    


}

module.exports=apiFeatures