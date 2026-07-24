export default function MatchScoreBadge({score}) {


let color;

let label;



if(score >= 80){

 color="#16a34a";

 label="Excellent Match";


}

else if(score >=50){


 color="#f59e0b";

 label="Good Match";


}

else{


 color="#94a3b8";

 label="Low Match";


}




return (


<div className="score-container">


<div

style={{

width:"85px",

height:"85px",

borderRadius:"50%",

border:`6px solid ${color}`,

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:"22px",

fontWeight:"800",

color:color,

background:"white"

}}

>

{Math.round(score)}%

</div>



<span

style={{

color:color,

fontSize:"12px",

fontWeight:"700"

}}

>

{label}

</span>



</div>


);


}