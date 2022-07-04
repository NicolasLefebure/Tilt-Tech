// var button = document.getElementById("Submit");
// button.onclick = changeGreeting;

/*
function changeGreeting(){
    var greeting = document.getElementsByTagName("h1")[0];
    var input = document.getElementById("T").value;
    greeting.innerHTML = "Hello, your total consumption is " + input + " [kWh]";
} */

getDataTilt();
function getDataTilt(){
    $.get("/datatilt", function(data){
        if(!data){
            console.log("No data received");
        }
        console.log("Received data");
        for(var i = 0; i < data.length; i++){
            console.log(data[i].lname);
        }
        showDatatilt(data);
    });
}

function showDatatilt(datatilt){

    // Get Data
    var i = datatilt.length - 1;

    var Fridge_nb = datatilt[i].Fridgename;
    var WashingMachine_nb = datatilt[i].WashingMachinename;
    var TV_nb = datatilt[i].TVname;
    var Freezer_nb = datatilt[i].Freezername;
    var Dishwasher_nb = datatilt[i].Dishwashername;
    var InductionStove_nb = datatilt[i].InductionStovename;
    var SmallLight_nb = datatilt[i].SmallLightname;
    var BigLight_nb = datatilt[i].BigLightname;
    var T_tot = datatilt[i].fname;

    var Fridge_power = 2;
    var WashingMachine_power = 1.5;
    var TV_power = 0.5;
    var Freezer_power = 2.5;
    var Dishwasher_power = 2.5;
    var InductionStove_power = 3;
    var SmallLight_power = 0.1;
    var BigLight_power = 0.8;

    var Time_F_min = 6;
    var Time_A_min = 1;
    var Time_L_min = 4;

    // Error Handling
    if (isNaN(T_tot)) {

        var section = document.createElement("section");
        section.className += "Answer";
        var data_error_1 = document.createElement("p");
        data_error_1.innerHTML = "Error: your total measured consumption is NaN.";
        data_error_1.style.color = 'red';
        section.appendChild(data_error_1);
        var dataSection = document.getElementById
        ("Answers");
        dataSection.appendChild(section);
    
    /* } else if (!(Number.isInteger(Fridge_nb) || Number.isInteger(WashingMachine_nb) || Number.isInteger(TV_nb) || Number.isInteger(Freezer_nb) ||
    Number.isInteger(Dishwasher_nb) || Number.isInteger(InductionStove_nb) || Number.isInteger(SmallLight_nb) || Number.isInteger(BigLight_nb))) {
        console.log(Number.isInteger(Fridge_nb));
        var section = document.createElement("section");
        section.className += "Answer";
        var data_error_1 = document.createElement("p");
        data_error_1.innerHTML = "Error: one of your answers for appliances is wrong.";
        data_error_1.style.color = 'red';
        section.appendChild(data_error_1);
        var dataSection = document.getElementById
        ("Answers");
        dataSection.appendChild(section);
        */
    } else if (T_tot > 75){

        var section = document.createElement("section");
        section.className += "Answer";
        var data_error_1 = document.createElement("p");
        data_error_1.innerHTML = "Error: your total measured consumption is too high.";
        data_error_1.style.color = 'red';
        section.appendChild(data_error_1);
        var dataSection = document.getElementById
        ("Answers");
        dataSection.appendChild(section);

    } else if(T_tot < Time_F_min*(Fridge_nb*Fridge_power + Freezer_nb*Freezer_power)
    + Time_A_min*(WashingMachine_nb*WashingMachine_power + Dishwasher_nb*Dishwasher_power + InductionStove_nb*InductionStove_power)
    + Time_L_min*(TV_nb*TV_power + SmallLight_nb*SmallLight_power + BigLight_nb*BigLight_power)){

        var section = document.createElement("section");
        section.className += "Answer";
        var data_error_1 = document.createElement("p");
        data_error_1.innerHTML = "Error: your total measured consumption is too low.";
        data_error_1.style.color = 'red';
        section.appendChild(data_error_1);
        var dataSection = document.getElementById
        ("Answers");
        dataSection.appendChild(section);

    } else {

    // Data Compute
    var Time_F_tmp = 0;
    var Time_A_tmp = 0;
    var Time_L_tmp = 0;
    var Power_Time_tmp = 0;
    for(var Time_F = 6; Time_F <= 9; Time_F++){
        for(var Time_A = 1; Time_A <= 4; Time_A++){
            for(var Time_L = 4; Time_L <= 24; Time_L++){
                var Time = Time_F*(Fridge_nb*Fridge_power + Freezer_nb*Freezer_power)
                 + Time_A*(WashingMachine_nb*WashingMachine_power + Dishwasher_nb*Dishwasher_power + InductionStove_nb*InductionStove_power)
                 + Time_L*(TV_nb*TV_power + SmallLight_nb*SmallLight_power + BigLight_nb*BigLight_power);
                if(Time < T_tot && Time > Power_Time_tmp){
                    Power_Time_tmp = Time;
                    Time_F_tmp = Time_F;
                    Time_A_tmp = Time_A;
                    Time_L_tmp = Time_L;
                }
            }
        }
    }
    // console.log(Power_Time_tmp);

    // ShowData

    let appliances_name = ["Fridge", "Washing machine", "TV", "Freezer", "Dishwasher", "Induction stove", "Small light", "Big light"];
    let appliances = [Fridge_power, WashingMachine_power, TV_power, Freezer_power, Dishwasher_power, InductionStove_power, SmallLight_power, BigLight_power];
    let time_identifiers = [Time_F_tmp, Time_A_tmp, Time_L_tmp, Time_F_tmp, Time_A_tmp, Time_A_tmp, Time_L_tmp, Time_L_tmp];
    let nb_identifiers = [Fridge_nb, WashingMachine_nb, TV_nb, Freezer_nb, Dishwasher_nb, InductionStove_nb, SmallLight_nb, BigLight_nb]; 

    var dataSection = document.getElementById("Answers");

    var results_bar = document.createElement("div");
    results_bar.className = "results-bar";
    dataSection.appendChild(results_bar);

    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        

    } else {


    for (let i = 0; i < appliances.length; i++) {
        

        if(nb_identifiers[i] > 0){
            var bar = document.createElement("div");
            bar.className = "bar";
            results_bar.appendChild(bar);

            var info = document.createElement("div");
            info.className = "info";
            info.id = "info";
            bar.appendChild(info);

            var span1 = document.createElement("span");
            info.appendChild(span1);

            var progress_line = document.createElement("div");
            progress_line.className = "progress-line";
            progress_line.id = "progress-line";
            bar.appendChild(progress_line);

            var span2 = document.createElement("span");
            span2.id = "span-progress-line" + i;
            progress_line.appendChild(span2);

            var data_Fridge = document.createElement("p");
            data_Fridge.innerHTML = "The energy consumption of each " + appliances_name[i] + " is: " + Math.round(time_identifiers[i]*appliances[i]* 100) / 100 + " kwh/day";// + Math.round(100*time_identifiers[i]*appliances[i]/Power_Time_tmp) + "% of the total consumption.";
            info.appendChild(data_Fridge);
            document.getElementById("span-progress-line" + i).style.width = Math.round(100*time_identifiers[i]*appliances[i]/Power_Time_tmp) + "%";
            document.getElementById("span-progress-line" + i).innerHTML= Math.round(100*time_identifiers[i]*appliances[i]/Power_Time_tmp) + "%";
        }
        
    }

    var title2 = document.createElement("div");
    title2.className = "title2"
    title2.innerHTML = "Analysis results:";
    dataSection.insertBefore(title2,results_bar);
    }
    }
}
