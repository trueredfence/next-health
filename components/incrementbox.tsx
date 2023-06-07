

interface IncrementBtn {
    name:string
    value:number
    increment(name:string):void
    decrement(name:string):void
    foodlist?:object
    label: string
}

export default function IncrementButton({name, value, increment, decrement, label}:IncrementBtn) {

    return (
        <div className="text-center mx-1 md:mx-0"> 
        <label className="w-full text-gray-700 text-sm font-semibold capitalize">{label}</label>
          <div className="flex flex-row h-10 w-full rounded-lg bg-transparent mt-1">
            <button type="button" disabled={value < 1} onClick={() => decrement(name)} name="bread" className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
              <span className="m-auto text-2xl font-thin">−</span>
            </button>
              <input type="number" defaultValue={value} className="outline-none focus:outline-none text-sm text-center w-full bg-gray-300 font-semibold hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 " name={name} />
            <button type="button" disabled={value > 19}  onClick={() => increment(name)} name="bread" className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
              <span className="m-auto text-2xl font-thin">+</span>
            </button>
          </div>
      </div> 
    )
  }