import {contactForm,form,storage,UserInfo,ui} from "./Register.js";


const createDatabase = () => {
    storage.database=indexedDB.open('flex Site',10)

    storage.database.addEventListener('error',e=>{
        console.warn('database error',e)
    })

    storage.database.addEventListener('success',e=>{
        storage.databaseInfo=e.target.result
        storage.getData()
        console.log('database success',e)
    })

    storage.database.addEventListener('upgradeneeded',e=>{
        storage.databaseInfo=e.target.result

        if(!storage.databaseInfo.objectStoreNames.contains('contact')){
            storage.databaseInfo.createObjectStore('contact',{
                keyPath:'userId'
            })
        }
        // if(storage.databaseInfo.objectStoreNames.contains('contact')){
        //     storage.databaseInfo.deleteObjectStore('contact')
        // }

        console.log(storage.databaseInfo.objectStoreNames)

        console.log('database upgrade',e)
    })
}

const setDatabase = e => {
    e.preventDefault()
    if(!form.validation()){
        form.userMessage.style.display='inline-block'

    }else{
        form.userMessage.style.display='none'

        let newInfo=new UserInfo(form.name.value,form.email.value,form.number.value,form.message.value)

        storage.storeData(newInfo)

        form.clearInputs()

        storage.getData()
    }
}
ui.contactContainer.addEventListener('click',e=>{
    if(e.target.tagName==='BUTTON'){
        storage.deleteData(Number(e.target.dataset.userid))
        e.target.parentElement.parentElement.remove()

    }
})





window.addEventListener('load',createDatabase)
contactForm.addEventListener('submit',setDatabase)
