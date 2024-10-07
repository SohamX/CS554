// You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
import { ObjectId } from "mongodb";

const stringExistandType=(str,param,lenchecker=false,maxlength=0,minlength=0)=>{
    if(str===null){
        throw new Error(`${(param)} parameter cannot be null`)
    }
    if(str===undefined){
        throw new Error(`${(param)} parameter cannot be undefined`)
    }
    if(typeof(str)!=='string'){
        throw new Error(`${(param)} parameter has value ${str} which is a ${typeof(str)} and not of the type string`)
    }
    str = str.trim()
    if(str.length===0){
        throw new Error(`${(param)} parameter cannot be a empty string`)
    }
    if(lenchecker){
        if(str.length>maxlength){
            throw new Error(`${(param)} parameter should not be longer than ${maxlength} characters long`)
        }
        if(str.length<minlength){
            throw new Error(`${(param)} parameter should not be shorter than ${minlength} characters long`)
        }
    }
    return str;
}

const onlyletters=(str,param)=>{
    str = str.toLowerCase().trim()
    const totalLetters = str.split('').filter(x=>x>='a'&&x<='z' || x===' ' || x==='.')//only letters, dots and spaces. in future if demands change tar lakshat thev to only remove x===' ' if spaces are not allowed
    if(totalLetters.length!==str.length){
        throw new Error(`${(param)} parameter should only contain letters`)
    }
    return;
}

const dateFormat=(dateReleased,param)=>{
    if(dateReleased.length!==10){
        throw new Error (`parameter ${(param)} is not in proper date format`)
      }
    let date = dateReleased.split('/').map(x=>x)
    if(date.length!==3){
        throw new Error (`parameter ${(param)} is not in proper date format`)
    }
    return date
}

const isValidDate=(month,date,year,param)=>{
    let Today = new Date()
    if(month.length!==2||date.length!==2||year.length!==4){
        throw new Error (`parameter ${(param)} is not in proper date format`)
    }
    if(isNaN(month)||isNaN(date)||isNaN(year)){
        throw new Error (`parameter ${(param)} is not in proper date format`)
    }
    if(Number(year)<0){
        throw new Error (`parameter ${(param)} has an invalid ${year}`)
    }
    if(Number(month)<1||Number(month)>12){
        throw new Error (`parameter ${(param)} has an invalid month ${month}`)
    }
    if(Number(date)<1||Number(date)>31){
        throw new Error (`parameter ${(param)} has an invalid day ${date}`)
    }

    if(Number(month)==2){
        if(Number(date)>28){
            throw new Error (`parameter ${(param)} has an invalid day value ${date} for February`)
        }
    }else{
        if(['04','06','09','11'].includes(month)){
            if(Number(date)>30){
                throw new Error (`parameter ${(param)} has an invalid day value ${date} for the month ${month}`)
            }
        }
    }

    if(Number(year)>Today.getFullYear()){
        throw new Error (`parameter ${(param)} cannot have a future year value ${year}`)
    }
    if(Number(year)===Today.getFullYear()&&(Today.getMonth()+1)<Number(month)){
        throw new Error (`parameter ${(param)} cannot have a future month value ${month} for current year`)
    }
    if(Number(year)===Today.getFullYear()&&(Today.getMonth()+1)===Number(month)&&Today.getDate()<Number(date)){
        throw new Error (`parameter ${(param)} cannot have a future day value ${date} for current year and month`)
    }
}

const numberExistandType=(num,param,int=true,dec=2)=>{
    if(num===null){
        throw new Error(`parameter ${(param)} cannot be null`)
    }
    if(num===undefined){
        throw new Error(`parameter ${(param)} cannot be undefined`)
    }
    if(int){
        if(!Number.isInteger(num)){
            throw new Error(`parameter ${(param)} has value ${num} which is not of the type Integer`)
        }
    }
    else{
        if(typeof(num)!=='number'&&!isNaN(num)){
            throw new Error(`parameter ${(param)} has value ${num} which is a ${typeof(num)} and not of the type number`)
        }
        if(((num.toString()).split('.')[1]|| '').length>dec){
            throw new Error (`parameter ${(param)} of value ${num} should not exceed ${dec} decimal places`)
        }
    }
    if(num<0){
        throw new Error(`parameter ${(param)} is a number less than 0`) 
    }
}

const passwordChecker=(password)=>{
    const special=['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}', '|', '\\', ';', ':', '\'', '"', '<', '>', ',', '/', '?', '~', '`', '_', '-', '.']
    let upper = 0 
    let digit = 0
    let specials=0
    for(let i=0;i<password.length;i++){
        if(password[i]>='A'&&password[i]<='Z'){
            upper++;
            continue;
        }
        if(password[i]>='0'&&password[i]<='9'){
            digit++;
            continue;
        }
        if(special.includes(password[i])){
            specials++;
            continue;
        }
        if(password[i]===' '){
            throw new Error(`The password parameter cannot contain spaces`)
        }
    }
    if(upper===0){
        throw new Error(`The password parameter must contain atleast one uppercase letter`)
    }
    if(digit===0){
        throw new Error(`The password parameter must contain atleast one digit`)
    }
    if(specials===0){
        throw new Error(`The password parameter must contain atleast one special character`)
    }
}

const arrayExistandType=(arr,param)=>{
    if(arr===null){
        throw new Error(`parameter ${(param)} cannot be null`)
    }
    if(arr===undefined){
        throw new Error(`parameter ${(param)} cannot be undefined`)
    }
    if(!Array.isArray(arr)){
        throw new Error(`parameter ${(param)} should be an array type input`)
    }
    if(arr.length==0){
        throw new Error(`parameter ${(param)} cannot be empty`)
    }
}

const validObject=(id)=>{
    if(!ObjectId.isValid(id)){
        throw new Error(`The parameter id is not a valid ObjectId`)
    }
}

const isValidWebsite=(manufacturerWebsite)=>{
    if(manufacturerWebsite.slice(0,11)!=='http://www.'){
    throw new Error (`${manufacturerWebsite} is not a valid website URL because it doesnt start with 'http://www.'`)
  }
  if(manufacturerWebsite.slice(-4)!=='.com'){
    throw new Error (`${manufacturerWebsite} is not a valid website URL because it doesnt end with '.com'`)
  }
  let temp = manufacturerWebsite.slice(11,-4)
  if(temp.length<5){
    throw new Error (`${manufacturerWebsite} is not a valid website URL because it doesnt have atleast 5 characters between 'http://www.' and '.com'`)
  }
  const special=['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}', '|', '\\', ';', ':', '\'', '"', '<', '>', ',', '/', '?', '~', '`']
  let chars = special.filter(x=>temp.indexOf(x)!==-1)
  if(chars.length!==0){
      throw new Error(`The manufacturerWebsite parameter cannot conatin special character(s) like ${(chars.join())} between 'http://www.' and '.com'`)
  }
  const allow=['-','_','.']
  let allo = temp.split('').filter(x=>allow.indexOf(x)!==-1)
  if(allo.length===temp.length){
    throw new Error(`The manufacturerWebsite parameter cannot just be a string of "-" or "-" or "_" characters: ${(temp)}, between 'http://www.' and '.com'`)
  }
}

const booleanExistsandType=(boo,param)=>{
    if(boo===null){
        throw new Error(`${(param)} parameter cannot be null`)
      }
      if(boo===undefined){
          throw new Error(`${(param)} parameter cannot be undefined`)
      }
      if(typeof(boo)!=='boolean'){
          throw new Error(`${(param)} parameter has value ${boo} which is a ${typeof(boo)} and not of the type boolean`)
      }
}

const numberRange=(num,param,low,high)=>{
    if(num<low){
        throw new Error(`${(param)} parameter with value ${num}, cannot be less than ${low}`)
    }
    if(num>high){
        throw new Error(`${(param)} parameter with value ${num}, cannot be greater than ${high}`)
    }
}

export{arrayExistandType,booleanExistsandType,dateFormat,onlyletters,isValidDate,isValidWebsite,numberExistandType,numberRange,passwordChecker,stringExistandType,validObject}