import Head from "next/head"
import React, {useState, FormEventHandler, useEffect} from "react"
import IncrementButton from "@/components/incrementbox"
import type { FoodItems, UserInfo } from "@/types/health"
import Swal from 'sweetalert2'

export default function Home() {

  const foodList = {
    bread:0, oats:0, roti:0, idly:0, dosa:0, milk:0, pratha:0, puri:0, corn:0, dal:0, sambar:0, vegitable:0, fish:0, dahi:0, kichri:0, chicken:0, egg:0,
    choley:0, tea:0, salad:0, rice:0, paneer:0
  }

  const foodProrteinValue = {
    bread:1.4, oats:16.0, roti:3.0, idly:1.0, dosa:2.0, milk:3.4, pratha:4.1, puri:2.0, corn:6.6, dal:3.0, sambar:2.1, vegitable:0, fish:8.75, dahi:2.6, kichri:4.3, chicken:8.0, egg:3.6,
    choley:4.2, tea:1.0, salad:0, rice:2.7, paneer:20
   }

  let userHealthAssement = {
    proteinIntake:0,
    proteinReq:0,
    calReq:0,
    bmr:0,
    idealBodyWeght:0
  }
  
  
  const [foodItemsValues, setFoodItemsValue] = useState<FoodItems>(foodList)
  
  const [userInfo, setUserInfo] = useState<UserInfo>({name:"", age:"", height:"", weight:"", gender:"", bodystate:"", phyActivity:""}) 

  const increment = (name:string)=>{   
    setFoodItemsValue(prev => ({ ...foodItemsValues, [name]: prev[name as keyof typeof foodList] + 1 }))
    // let itemQty = foodItemsValues[name as keyof typeof foodItemsValues]    
    // let proteinVal = foodProrteinValue[name as keyof typeof foodProrteinValue]    
    //setPintake(Math.round(pIntake + (proteinVal * itemQty)))   
    //setFoodItemsValue(prev => ({ ...foodItemsValues, [name]: parseInt(prev[name as keyof typeof foodList], 10) + 1 }))
  }
  
  const decrement = (name:string) => {   
    setFoodItemsValue(prev => ({ ...foodItemsValues, [name]: prev[name as keyof typeof foodList] - 1 }))
    // let itemQty = foodItemsValues[name as keyof typeof foodItemsValues]
    // let proteinVal = foodProrteinValue[name as keyof typeof foodProrteinValue]
    // setPintake(Math.round(pIntake - (proteinVal * itemQty)))
    //setFoodItemsValue(prev => ({ ...foodItemsValues, [name]: parseInt(prev[name as keyof typeof foodList], 10) - 1 }))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()   
    const { name, age, height, weight, gender, bodystate, phyActivity } = userInfo
    if(name.trim().length !== 0 &&
      age.trim().length !== 0 &&
      height.trim().length !== 0 &&
      weight.trim().length !== 0 &&
      gender.trim().length !== 0 &&
      bodystate.trim().length !== 0 &&
      phyActivity.trim().length !== 0
    ){
     
      userHealthAssement.idealBodyWeght = parseInt(userInfo.height) - 100
      const bmr = (userInfo.gender == 'Female')? Math.round(655.1 + (9.563 * userHealthAssement.idealBodyWeght) + (1.850 * parseInt(userInfo.height)) - (4.676 * parseInt(userInfo.age))):Math.round(66.5 + (13.75 * userHealthAssement.idealBodyWeght) + (5.003 * parseInt(userInfo.height)) - (6.75 * parseInt(userInfo.age)));
      userHealthAssement.bmr = bmr
      setCalAndProtein(bmr)
      proteinRequired()     
      udateProtein()     
      Swal.fire({                       
        icon: 'success',
        width: 400,
        title: 'Dear ! '+userInfo.name+' your protein assessment details',
        html: "Calorie Required : <b>"+userHealthAssement.calReq+"</b> <br> Ideal bodyweight should be : <b>"+userHealthAssement.idealBodyWeght+"kg</b> <br> Protein Required :  <b>"+userHealthAssement.proteinReq+" gm</b> <br> Your Protein Tank : <b>"+userHealthAssement.proteinIntake+" gm</b><br> Your Protein Deficiency Per/Day : <b>"+ (userHealthAssement.proteinReq - userHealthAssement.proteinIntake)+"gm</b>",
        showConfirmButton: true,        
      })
    }else{
      Swal.fire({                       
        icon: 'error',
        width: 400,
        title: 'Error !',
        html: "All profile fields are required you can skip food details",
        showConfirmButton: true,        
      })
    }
  }

  const setCalAndProtein = (bmr:number)=>{
      switch (userInfo.phyActivity) {
        case '1':   
          userHealthAssement.calReq =  Math.round(bmr * 1.2) 
          userHealthAssement.proteinReq = Math.round(userHealthAssement.idealBodyWeght* 0.8) 
        break;
        case '2':
          userHealthAssement.calReq =  Math.round(bmr * 1.375) 
          userHealthAssement.proteinReq = Math.round(userHealthAssement.idealBodyWeght* 1)    
        break;
        case '3':
          userHealthAssement.calReq =  Math.round(bmr * 1.55) 
          userHealthAssement.proteinReq = Math.round(userHealthAssement.idealBodyWeght* 1.2)             
        break;
        case '4':
          userHealthAssement.calReq =  Math.round(bmr * 1.725) 
          userHealthAssement.proteinReq = Math.round(userHealthAssement.idealBodyWeght* 1.4) 
        break;
        case '5':
          userHealthAssement.calReq =  Math.round(bmr * 1.9) 
          userHealthAssement.proteinReq = Math.round(userHealthAssement.idealBodyWeght* 1.7)        
        break;
        default:
          userHealthAssement.calReq =  Math.round(bmr * 1.2) 
          userHealthAssement.proteinReq = Math.round(userHealthAssement.idealBodyWeght* 1)
        break;
      }
  }

  const proteinRequired = () =>{
    if(userInfo.bodystate == 'Pregnant'){
      userHealthAssement.proteinReq = Math.round(userHealthAssement.proteinReq + 25)
    }else if(userInfo.bodystate == 'Lactating'){
      userHealthAssement.proteinReq = Math.round(userHealthAssement.proteinReq + 15)
    }
  }

  const udateProtein = ()=>{  
    
    userHealthAssement.proteinIntake = Math.round(
        (foodProrteinValue.bread*foodItemsValues.bread)+(foodProrteinValue.oats*foodItemsValues.oats)+(foodProrteinValue.roti*foodItemsValues.roti)+
        (foodProrteinValue.idly*foodItemsValues.idly)+(foodProrteinValue.egg*foodItemsValues.egg)+
        (foodProrteinValue.dosa*foodItemsValues.dosa)+(foodProrteinValue.milk*foodItemsValues.milk)+(foodProrteinValue.pratha*foodItemsValues.pratha)+
        (foodProrteinValue.puri*foodItemsValues.puri)+(foodProrteinValue.paneer*foodItemsValues.paneer)+
        (foodProrteinValue.corn*foodItemsValues.corn)+(foodProrteinValue.dal*foodItemsValues.dal)+(foodProrteinValue.sambar*foodItemsValues.sambar)+
        (foodProrteinValue.vegitable*foodItemsValues.vegitable)+(foodProrteinValue.fish*foodItemsValues.fish)+
        (foodProrteinValue.dahi*foodItemsValues.dahi)+(foodProrteinValue.kichri*foodItemsValues.kichri)+
        (foodProrteinValue.chicken*foodItemsValues.chicken)+(foodProrteinValue.choley*foodItemsValues.choley)+
        (foodProrteinValue.tea*foodItemsValues.tea)+(foodProrteinValue.salad*foodItemsValues.salad)+(foodProrteinValue.rice*foodItemsValues.rice)
    )   
  }

 return (
  <>
  <div>
    <Head><title>Protein Assesment Form</title></Head>
  </div>
  <div className="w-screen flex flex-col items-center justify-center mt-4">
    <div className="uppercase text-lg text-gray-700 font-bold">Protein Assessment Form</div>
    <div className="bg-white rounded-sm p-4 w-10/12 mt-4 min-w-min shadow-sm">
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 content-center gap-2">
      <div className="bg-gray-100 p-4 rounded-md mt-2 ">            
        <input
          onChange={({target}) =>
            setUserInfo({ ...userInfo, name: target.value })
          }
          type="text" 
          className="bg-gray-100 outline-none w-full text-sm" 
          name="name" 
          placeholder="Your Name" />
      </div>

      <div className="bg-gray-100 p-4 rounded-md mt-2">            
        <input
          onChange={({target}) =>
            setUserInfo({ ...userInfo, age: target.value })
          }
          type="number" 
          className="bg-gray-100 outline-none w-full text-sm " 
          name="age" 
          placeholder="Your age in years" />
      </div>

      <div className="bg-gray-100 p-4  rounded-md mt-2">            
        <input
        onChange={({target}) =>
          setUserInfo({ ...userInfo, weight: target.value })
        }
          type="number" 
          className="bg-gray-100 outline-none w-full text-sm " 
          name="weight" 
          placeholder="Your weight in kg" />
      </div>

      <div className="bg-gray-100 p-4  rounded-md mt-2">            
        <input
          onChange={({target}) =>
            setUserInfo({ ...userInfo, height: target.value })
          }
          type="number" 
          className="bg-gray-100 outline-none w-full text-sm  " 
          name="height" 
          placeholder="Your height in cm" />
      </div>

      </div> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-2 content-center gap-2">
      <div className="bg-gray-100 p-4  rounded-md mt-2">            
        <select name="gender" value={userInfo.gender} className="w-full bg-gray-100 outline-none text-sm text-gray-400"                  
        onChange={({target}) =>
          setUserInfo({ ...userInfo, gender: target.value })
        }
        >
          <option label="Choose your gender"></option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>              
        </select>
      </div>

      <div className="bg-gray-100 p-4  rounded-md mt-2">            
        <select name="bodystate" value={userInfo.bodystate} className="w-full bg-gray-100 outline-none text-sm text-gray-400"
          onChange={({target}) =>
            setUserInfo({ ...userInfo, bodystate: target.value })
          }
          >
          <option label="Choose your body state"></option>
          <option value="Adult">Adult</option>
          <option value="Children">Children</option>
          <option value="Pregnant">Pregnant</option>
          <option value="Lactating">Lactating</option>              
        </select>
      </div>

      <div className="bg-gray-100 p-4  rounded-md mt-2">            
        <select name="phyActivity" value={userInfo.phyActivity} className="w-full bg-gray-100 outline-none text-sm text-gray-400"
          onChange={({target}) =>
            setUserInfo({ ...userInfo, phyActivity: target.value })
          }
          >
        <option label="Choose your physical activity"></option>
        <option value="1">Sedentary-Little or No Exercise</option>
        <option value="2">Light 1-3 time/week</option>
        <option value="3">Moderate 4-5 time/week</option>
        <option value="4">Very Active 6-7 time/week</option>
        <option value="5">Intense – hard daily exercise/sports</option>            
      </select>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 content-center gap-2"> 
        <IncrementButton name="bread" value={foodItemsValues.bread} increment={increment} decrement={decrement} label="bread"/>
        <IncrementButton name="roti" value={foodItemsValues.roti} increment={increment} decrement={decrement} label="roti"/>
        <IncrementButton name="oats" value={foodItemsValues.oats} increment={increment} decrement={decrement} label="oats (100gm)"/>
        <IncrementButton name="idly" value={foodItemsValues.idly} increment={increment} decrement={decrement} label="idly"/>                
        <IncrementButton name="dosa" value={foodItemsValues.dosa} increment={increment} decrement={decrement} label="dosa (plain)"/>
        <IncrementButton name="milk" value={foodItemsValues.milk} increment={increment} decrement={decrement} label="milk (200gm)"/>
        <IncrementButton name="pratha" value={foodItemsValues.pratha} increment={increment} decrement={decrement} label="pratha"/>
        <IncrementButton name="puri" value={foodItemsValues.puri} increment={increment} decrement={decrement} label="puri"/>                
    </div> 
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 content-center gap-2">     
        <IncrementButton name="corn" value={foodItemsValues.corn} increment={increment} decrement={decrement} label="corn (100gm)"/>
        <IncrementButton name="dal" value={foodItemsValues.dal} increment={increment} decrement={decrement} label="dal (75gm)"/>
        <IncrementButton name="sambar" value={foodItemsValues.sambar} increment={increment} decrement={decrement} label="sambar (100gm)"/>
        <IncrementButton name="vegitable" value={foodItemsValues.vegitable} increment={increment} decrement={decrement} label="vegitable"/>                
        <IncrementButton name="fish" value={foodItemsValues.fish} increment={increment} decrement={decrement} label="fish (50gm)"/>
        <IncrementButton name="dahi" value={foodItemsValues.dahi} increment={increment} decrement={decrement} label="dahi (75gm)"/>
        <IncrementButton name="kichri" value={foodItemsValues.kichri} increment={increment} decrement={decrement} label="kichri"/>
        <IncrementButton name="chicken" value={foodItemsValues.chicken} increment={increment} decrement={decrement} label="chicken (1pc)"/>                
    </div>      
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 content-center gap-2">  
        <IncrementButton name="egg" value={foodItemsValues.egg} increment={increment} decrement={decrement} label="egg"/>
        <IncrementButton name="choley" value={foodItemsValues.choley} increment={increment} decrement={decrement} label="choley (100gm)"/>
        <IncrementButton name="tea" value={foodItemsValues.tea} increment={increment} decrement={decrement} label="tea"/>
        <IncrementButton name="rice" value={foodItemsValues.rice} increment={increment} decrement={decrement} label="rice (100gm)"/>                
        <IncrementButton name="salad" value={foodItemsValues.salad} increment={increment} decrement={decrement} label="salad"/>
        <IncrementButton name="paneer" value={foodItemsValues.paneer} increment={increment} decrement={decrement} label="Paneer (100gm)"/>
        <IncrementButton name="NA" value={0} increment={increment} decrement={decrement} label="NA"/>
        <IncrementButton name="NA" value={0} increment={increment} decrement={decrement} label="NA"/>                
    </div>          
      <div className="flex items-center justify-center mt-4">
        <button type="submit" className={`flex items-center justify-center border-2 rounded-md w-64 px-2 py-2 font-semibold bg-cyan-800 text-cyan-200`}>
          <div>Check Details</div>                        
        </button>
      </div>
      </form>
      </div> 
      <div className="w-10/12 p-4 mt-4 text-sm text-gray-600">
        <div className="mg-b-2">Copyright © 2023. Desiteck. All Rights Reserved.</div>
        <div>Check Your Protein.</div>
        <div className='text-justify'>DISCLAIMER : Information provided on this website is of a general nature only and is included for the sole purpose of providing general information about protein intake as per ICMR. This information is not intended to be a subtitute for individualised professional medical advice, diagnosis or treatment and reliance should not be place on it. For presonalised medical or nutition advice, user should make an appointment with their doctor, dietitian or qulified health care professional.</div>        
      </div>
  </div>
  </>
 )
}
