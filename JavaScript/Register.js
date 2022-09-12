const contactForm=document.getElementById('contact-us-form')
class Form {
    constructor() {
        this.name=document.getElementById('name')
        this.email=document.getElementById('email')
        this.number=document.getElementById('number')
        this.message=document.getElementById('message')
        this.userMessage=document.querySelector('.user-message')
        this.nameRegex=/^[a-zA-Z]+$/
        this.emailRegex=/^([^\_\.])([a-zA-Z0-9\_\.])+@([a-zA-Z]{4,6})\.([a-zA-Z]{2,3})$/
        this.numberRegex=/^(\+|00)(\d)+$/
    }
    clearInputs(){
        this.name.value=''
        this.email.value=''
        this.number.value=''
        this.message.value=''
    }
    validation(){
        if(!this.nameRegex.test(this.name.value)){
            return false
        }else if(!this.emailRegex.test(this.email.value)){
            return  false
        }else if(!this.numberRegex.test(this.number.value)){
            return  false
        }else {
            return  true
        }
    }
}


class Storage {
    constructor() {
        this.database=null
        this.databaseInfo=null
        this.transaction=null
        this.contactDatabase=null
        this.request=null

    }
    createTx(mode){
        this.transaction=this.databaseInfo.transaction('contact',mode)

        this.transaction.addEventListener('error',e=>{
            console.warn('transaction error',e)
        })

        this.transaction.addEventListener('complete',e=>{
            console.log('transaction success',e)
        })
        return this.transaction
    }

    storeData(newData){
        this.contactDatabase=storage.createTx("readwrite").objectStore('contact')
        console.log(this.contactDatabase)

        this.request=this.contactDatabase.add(newData)

        this.request.addEventListener('error',e=>{
            console.log('req error',e)
        })
        this.request.addEventListener('success',e=>{
            console.log('req success',e)
        })
    }

    getData(){
        this.contactDatabase=storage.createTx("readonly").objectStore('contact')
        console.log(this.contactDatabase)

        this.request=this.contactDatabase.getAll()

        this.request.addEventListener('error',e=>{
            console.log('get req error',e)
        })
        this.request.addEventListener('success',e=>{
            //// all data
            ui.showData(e.target.result)
            console.log('get req success',e)
        })

    }
    deleteData(userId){
        this.contactDatabase=storage.createTx("readwrite").objectStore('contact')

        this.request=this.contactDatabase.delete(userId)

        this.request.addEventListener('error',e=>{
            console.log('delete req error',e)
        })
        this.request.addEventListener('success',e=>{
            console.log('delete req success',e)
        })

    }

}

class UserInfo {
    constructor(name,email,number,message) {
        this.userId=Math.floor(Math.random()*9999)
        this.name=name
        this.email=email
        this.number=number
        this.message=message
    }
}


class UI {
    constructor() {
        this.contactContainer=document.getElementById('contact_details')
        this.dataFragment=null
    }
    showData(allData){
        this.dataFragment=allData.map(data=>{
           return ` <tr><td>${data.userId}</td><td>${data.name}</td><td>${data.number}</td><td>${data.email}</td><td>${data.message}</td><td><button data-userId="${data.userId}">remove</button></td></tr>`
        }).join('')
        this.contactContainer.insertAdjacentHTML('beforeend',this.dataFragment)
    }
}

let form=new Form()
let storage=new Storage()
let ui=new UI()
export {contactForm,form,storage,UserInfo,ui}