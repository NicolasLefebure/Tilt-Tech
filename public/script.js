
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
        
        if(window.performance.getEntriesByType("navigation")[0].type == 'reload'||
        window.performance.getEntriesByType("navigation")[0].unloadEventStart == 0){
            // do nothing
        }
        else {
            showDatatilt(data);
        }
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

    var Fridge_power = 2; // [kW]
    var WashingMachine_power = 1.5; // [kW]
    var TV_power = 0.5; // [kW]
    var Freezer_power = 2.5; // [kW]
    var Dishwasher_power = 2.5; // [kW]
    var InductionStove_power = 3; // [kW]
    var SmallLight_power = 0.1; // [kW]
    var BigLight_power = 0.8; // [kW]

    var Time_F_min = 6; // [h]
    var Time_A_min = 1; // [h]
    var Time_L_min = 4; // [h]

    var Time_F_max = 8; // [h]
    var Time_A_max = 4; // [h]
    var Time_L_max = 24; // [h]

    // Error Handling (Total measured energy)
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
    
    } else if (T_tot > 75){

        var section = document.createElement("section");
        section.className += "Answer";
        var data_error_2 = document.createElement("p");
        data_error_2.innerHTML = "Error: your total measured consumption is too high.";
        data_error_2.style.color = 'red';
        section.appendChild(data_error_2);
        var dataSection = document.getElementById
        ("Answers");
        dataSection.appendChild(section);

    } else if(T_tot < Time_F_min*(Fridge_nb*Fridge_power + Freezer_nb*Freezer_power)
    + Time_A_min*(WashingMachine_nb*WashingMachine_power + Dishwasher_nb*Dishwasher_power + InductionStove_nb*InductionStove_power)
    + Time_L_min*(TV_nb*TV_power + SmallLight_nb*SmallLight_power + BigLight_nb*BigLight_power)){

        var section = document.createElement("section");
        section.className += "Answer";
        var data_error_3 = document.createElement("p");
        data_error_3.innerHTML = "Error: your total measured consumption is too low.";
        data_error_3.style.color = 'red';
        section.appendChild(data_error_3);
        var dataSection = document.getElementById
        ("Answers");
        dataSection.appendChild(section);
    
    } else {
    
    // Data Compute
    var Time_F_tmp = 0;
    var Time_A_tmp = 0;
    var Time_L_tmp = 0;
    var Power_Time_tmp = 0;
    for(var Time_F = Time_F_min; Time_F <= Time_F_max; Time_F++){
        for(var Time_A = Time_A_min; Time_A <= Time_A_max; Time_A++){
            for(var Time_L = Time_L_min; Time_L <= Time_L_max; Time_L++){
                var Time = Time_F*(Fridge_nb*Fridge_power + Freezer_nb*Freezer_power)
                 + Time_A*(WashingMachine_nb*WashingMachine_power + Dishwasher_nb*Dishwasher_power + InductionStove_nb*InductionStove_power)
                 + Time_L*(TV_nb*TV_power + SmallLight_nb*SmallLight_power + BigLight_nb*BigLight_power); // [kWh]
                if(Time < T_tot && Time > Power_Time_tmp){
                    Power_Time_tmp = Time; // [kWh]
                    Time_F_tmp = Time_F; // [h]
                    Time_A_tmp = Time_A; // [h]
                    Time_L_tmp = Time_L; // [h]
                }
            }
        }
    }

    // ShowData
    let appliances_name = ["fridge", "washing machine", "TV", "freezer", "dishwasher", "induction stove", "small light", "big light"];
    let appliances = [Fridge_power, WashingMachine_power, TV_power, Freezer_power, Dishwasher_power, InductionStove_power, SmallLight_power, BigLight_power];
    let time_identifiers = [Time_F_tmp, Time_A_tmp, Time_L_tmp, Time_F_tmp, Time_A_tmp, Time_A_tmp, Time_L_tmp, Time_L_tmp];
    let nb_identifiers = [Fridge_nb, WashingMachine_nb, TV_nb, Freezer_nb, Dishwasher_nb, InductionStove_nb, SmallLight_nb, BigLight_nb]; 

    var dataSection = document.getElementById("Answers");

    var results_bar = document.createElement("div");
    results_bar.className = "results-bar";
    dataSection.appendChild(results_bar);

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

            var data_new = document.createElement("p");
            data_new.id = "data_new" + i;
            data_new.innerHTML = "The energy consumption of each " + appliances_name[i] + " is: " + Math.round(time_identifiers[i]*appliances[i]* 100) / 100 + " kWh/day";
            info.appendChild(data_new);
            document.getElementById("data_new" + i).style.textAlign = "left";
            document.getElementById("span-progress-line" + i).style.width = Math.round(100*time_identifiers[i]*appliances[i]/Power_Time_tmp* 10) / 10 + "%";
            document.getElementById("span-progress-line" + i).innerHTML= Math.round(100*time_identifiers[i]*appliances[i]/Power_Time_tmp* 10) / 10 + "%";
        }
        
    }

        var title2 = document.createElement("div");
        title2.className = "title2"
        title2.innerHTML = "Analysis results:";
        dataSection.insertBefore(title2,results_bar);
    }
}

// Step button management
jQuery('<div class="number-wrapper-nav"><div class="number-wrapper-button number-wrapper-up">+</div><div class="number-wrapper-button number-wrapper-down">-</div></div>').insertAfter('.number-wrapper input');
jQuery('.number-wrapper').each(function() {
  var spinner = jQuery(this),
    input = spinner.find('input[type="number"]'),
    btnUp = spinner.find('.number-wrapper-up'),
    btnDown = spinner.find('.number-wrapper-down'),
    min = input.attr('min'),
    max = input.attr('max');

  btnUp.click(function() {
    var oldValue = parseFloat(input.val());
    if (oldValue >= max) {
      var newVal = oldValue;
    } else {
      var newVal = oldValue + 1;
    }
    spinner.find("input").val(newVal);
    spinner.find("input").trigger("change");
  });

  btnDown.click(function() {
    var oldValue = parseFloat(input.val());
    if (oldValue <= min) {
      var newVal = oldValue;
    } else {
      var newVal = oldValue - 1;
    }
    spinner.find("input").val(newVal);
    spinner.find("input").trigger("change");
  });

});