import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
export type FilterOptionsState={
    id:string,
    label:string
}
const filteroptions:FilterOptionsState[]=[
    {
        id:'burger',
        label:'Burger'
    },
    {
        id:'thali',
        label:'Thali'
    },
    {
        id:'biryani',
        label:'Biryani'
    },
    {
        id:'momos',
        label:'Momos'
    }
];
const FilterPage = () => {
    const appliedFilterHandler=(value:string)=>{
        
    }
  return (
    <div className="md:w-60">
        <div className="flex items-center justify-between">
            <h1 className="font-medium text-lg">
                Filter by cuisines
            </h1>
            <Button variant='link'>Reset</Button>
        </div>
        {
            filteroptions.map((option)=>(
                <div key={option.id} className="flex items-center space-x-2 my-3">
                    <Checkbox id={option.id} onClick={()=>appliedFilterHandler(option.label)}/>
                    <Label className="text-sm font-medium leading-none">{option.label}</Label>
                </div>
            ))
        }
    </div>
  )
}

export default FilterPage