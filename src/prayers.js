let city = null
let country = null

let date = new Date()
let month = 0 + (date.getMonth() + 1).toString()
let day = date.getDate().toString()
let year = date.getFullYear().toString()

let daySuffix = '';
if (day === 1 || day === 21 || day === 31) {
	daySuffix = 'st';
} else if (day === 2 || day === 22) {
	daySuffix = 'nd';
} else if (day === 3 || day === 23) {
	daySuffix = 'rd';
} else {
	daySuffix = 'th';
}


let count = 0

const fajr = document.getElementById("Fajr")
const dhuhr = document.getElementById("Dhuhr")
const asr = document.getElementById("Asr")
const maghrib = document.getElementById("Maghrib")
const isha = document.getElementById("Isha")
const dateText = document.getElementById("date")
const timeText = document.getElementById("time")
const dateTextAr = document.getElementById("date-ar")
const timeTextAr = document.getElementById("time-ar")
const warningText = document.getElementById("warning")
const placeText = document.getElementById("place")
// const timeLeftText = document.getElementById("timetext")

const dropdown = document.getElementById("dropdownMenuButton1")

const locationBtn = document.getElementById("location")



const enterLocationBtn = document.getElementById("enterLocation")
const countryInput = document.getElementById("country")
const cityInput = document.getElementById("city")

let cityInputText = localStorage.getItem("cityInputText") || countryInput.value
let countryInputText = localStorage.getItem("countryInputText") || cityInput.value

countryInput.addEventListener("change", ()=>{ 
	// countryInput.value
	countryInputText = countryInput.value
})
cityInput.addEventListener("change", ()=>{ 
	// cityInput.value
	cityInputText = cityInput.value
})

const cards = [
	document.getElementById("card1"), 
	document.getElementById("card2"), 
	document.getElementById("card3"), 
	document.getElementById("card4"), 
	document.getElementById("card5")
]

const timeLeftTexts = [
	document.getElementById("timetext1"), 
	document.getElementById("timetext2"), 
	document.getElementById("timetext3"), 
	document.getElementById("timetext4"), 
	document.getElementById("timetext5")
]

const cardiconsA = [
	document.getElementById("card1iconA"), 
	document.getElementById("card2iconA"), 
	document.getElementById("card3iconA"), 
	document.getElementById("card4iconA"), 
	document.getElementById("card5iconA")
]

const cardiconsB = [
	document.getElementById("card1iconB"), 
	document.getElementById("card2iconB"), 
	document.getElementById("card3iconB"), 
	document.getElementById("card4iconB"), 
	document.getElementById("card5iconB")
]

const cardiconsC = [
	document.getElementById("card1iconC"), 
	document.getElementById("card2iconC"), 
	document.getElementById("card3iconC"), 
	document.getElementById("card4iconC"), 
	document.getElementById("card5iconC")
]

let data 
let geo

// console.log(date)

let hours = date.getHours()
let minutes = date.getMinutes()
let seconds = date.getSeconds()
let date_formatted = `${month}/${day}/${year} \n \n ${hours >= 12 ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}:${seconds <= 9 ? 0 + seconds.toString() : seconds} `

let useText = false

const x = document.getElementById("demo");
let lat
let long

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const lunarMonthsAr = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

var sound = new Howl({
	src: ['../athan.mp3']
});

function timeLeft(currentTime, targetTime) {
    // Parse the current time
    const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
    const currentDate = new Date();
    currentDate.setHours(currentHours, currentMinutes, 0, 0);

    // Parse the target time
    const [targetHours, targetMinutes] = targetTime.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(targetHours, targetMinutes, 0, 0);

    // Calculate the difference in milliseconds
    let diff = targetDate - currentDate;

    // If the target time is earlier than the current time, assume it's the next day
    if (diff < 0) {
        targetDate.setDate(targetDate.getDate() + 1);
        diff = targetDate - currentDate;
    }

    // Convert the difference to hours and minutes
    let totalMinutesLeft = Math.floor(diff / (1000 * 60));
    let hoursLeft = Math.floor(totalMinutesLeft / 60);
    let minutesLeft = totalMinutesLeft % 60;

    // Convert hours to 12-hour format
    if (hoursLeft >= 12) {
        hoursLeft -= 12;
    }

    // Create the formatted result
    const hoursText = hoursLeft > 0 ? `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}` : '';
    const minutesText = minutesLeft > 0 ? `${minutesLeft} Minute${minutesLeft > 1 ? 's' : ''}` : '';
    
    // Combine hours and minutes text
    let result = '';
    if (hoursText && minutesText) {
        result = `${hoursText}, \n ${minutesText}`;
    } else if (hoursText) {
        result = `${hoursText}`;
    } else if (minutesText) {
        result = `${minutesText}`;
    } else {
        result = '0 Minutes';
    }

    return result;
}
async function getDate(){
	fetch('https://api.aladhan.com/v1/gToH/' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear())
		.then(response => response.json())
		.then(data => {
			const hijriDate = data.data.hijri;
			const hijriMonth = hijriDate.month.number - 1; // Adjusting to array index
			const hijriDay = hijriDate.day;
			const hijriYear = hijriDate.year;


			// Convert Hijri day and year to Arabic numerals
			const arabicHijriDay = String(hijriDay).split('').map(digit => arabicNumerals[digit]).join('');
			const arabicHijriYear = String(hijriYear).split('').map(digit => arabicNumerals[digit]).join('');
			const arabicHours = hours === 0 ? '١٢' : (hours <= 12 ? String(hours).split('').map(digit => arabicNumerals[digit]).join('') : String(hours-12).split('').map(digit => arabicNumerals[digit]).join(''))
			const arabicMinutes = (minutes <= 9 ? (0 + String(minutes)).split('').map(digit => arabicNumerals[digit]).join('') : String(minutes).split('').map(digit => arabicNumerals[digit]).join('')) 
			// Display Hijri date with Arabic numerals
			dateTextAr.innerText = `${arabicHijriDay} ${lunarMonthsAr[hijriMonth]} ${arabicHijriYear} هـ`;

			// Display current time
			timeTextAr.innerText = `${arabicHours}:${arabicMinutes}`;
		})
		.catch(error => {
			console.error('Error fetching Hijri date:', error);
		});
}

function getLocation() {
	if((cityInputText == null || countryInputText == null) || (cityInputText == "" || countryInputText == "") || (cityInputText == " " || countryInputText == " ") && !useText) {
		// console.log(countryInputText, cityInputText)
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else if(useText) {
			console.log('not supported')
		}
	}
	else{
		// console.log("else")
		city = cityInputText
		country = countryInputText
		// console.log(countryInputText, cityInputText)
		getPrayers()
	}
	
}
async function showPosition(position) {	
	lat = position.coords.latitude
	long = position.coords.longitude

	const url2 = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
	try {
		const response = await fetch(url2);
		const result = await response.text();

		geo = JSON.parse(result);
	} catch (error) {
		console.error(error);
	}

	// console.log(geo)

	city = geo.city
	country = geo.countryCode

	getPrayers()

	placeText.innerText = `${city}, ${country}`
}

locationBtn.addEventListener("click", ()=>{
	countryInputText = ""
	cityInputText = ""
	localStorage.setItem("countryInputText", "")
	localStorage.setItem("cityInputText", "")
	getLocation()
	history.go(0)
})
locationBtn.addEventListener("touchstart", ()=>{
	getLocation()
	history.go(0)
}) 	

enterLocationBtn.addEventListener("click", ()=>{
	countryInputText = countryInput.value
	cityInputText = cityInput.value
	
	localStorage.setItem("countryInputText", countryInputText)
	localStorage.setItem("cityInputText", cityInputText)

	getLocation()
	history.go(0)
})

let prayerTimes
let prayers

let finalTime
let newPrayers = []

let methodName = dropdown.textContent
let method = null

switch(methodName){
	case "University of Islamic Sciences, Karachi":
		method = 1
		break
 
	case "Islamic Society of North America (ISNA)":
		method = 2
		break

	case "Muslim World League":
		method = 3
		break

	case "Umm Al-Qura University, Makkah":
		method = 4
		break

	case "Egyptian General Authority of Survey":
		method = 5
		break

	case "Institute of Geophysics, University of Tehran":
		method = 7
		break

	case "Gulf Region":
		method = 8
		break

	case "Kuwait":
		method = 9
		break

	case "Qatar":
		method = 10
		break
}

async function getPrayers(){
	// getLocation()
	const url = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${city}&country=${country}&method=${method}&adjustment=1`;
	try {
		const response1 = await fetch(url);
		const result1 = await response1.text();
	
		data = JSON.parse(result1);

		prayerTimes = data.data.timings

		prayers = [prayerTimes.Fajr, prayerTimes.Dhuhr, prayerTimes.Asr, prayerTimes.Maghrib, prayerTimes.Isha]

		for (let i = 0; i < prayers.length; i++){
			let hrs = prayers[i].split(":")[0]
			finalTime = (parseInt(hrs <= 12 ? hrs : hrs-12) + ":" + prayers[i].split(":")[1]).toString()
			newPrayers[i] = finalTime
		}
		

		fajr.innerText = newPrayers[0]
		dhuhr.innerText = newPrayers[1]
		asr.innerText = newPrayers[2]
		maghrib.innerText = newPrayers[3]
		isha.innerText = newPrayers[4]
		
	} catch (error) {
		console.error(error);
	}
}



function parseTime(timeStr) {
	const [hours, minutes] = timeStr.split(":").map(Number);
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}

function isWithinTimeFrame(startTime, endTime) {
	const now = new Date();
	return now >= startTime && now <= endTime;
}

function timeToMinutes(time) {
    let [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function findClosestTime(times, target) {
    const targetMinutes = timeToMinutes(target);

    let closestTime = times[0];
    let closestDifference = Math.abs(timeToMinutes(times[0]) - targetMinutes);

    for (let i = 1; i < times.length; i++) {
        let currentMinutes = timeToMinutes(times[i]);
        let currentDifference = Math.abs(currentMinutes - targetMinutes);

        if (currentDifference < closestDifference) {
            closestTime = times[i];
            closestDifference = currentDifference;
        }
    }

    return closestTime;
}

function step(){
	// getLocation()
	// getPrayers
	placeText.innerText = `${city}, ${country}`


	getDate()
	if(count < 1){
		getLocation()
		placeText.innerText = `${city}, ${country}`

	}
	
	date = new Date()
	hours = date.getHours()
	minutes = date.getMinutes()
	
	month = 0 + (date.getMonth() + 1).toString()
	day = date.getDate().toString()
	year = date.getFullYear().toString()

	daySuffix = '';
	if (day === 1 || day === 21 || day === 31) {
		daySuffix = 'st';
	} else if (day === 2 || day === 22) {
		daySuffix = 'nd';
	} else if (day === 3 || day === 23) {
		daySuffix = 'rd';
	} else {
		daySuffix = 'th';
	}

	dateText.innerText = `${day}${daySuffix} of ${months[month - 1]}, ${year}`
	timeText.innerText = `${(hours <= 12 && hours != 0) ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}`

	if (city != null && country != null && count > 0){
		for (let i = 0; i < prayers.length; i++){

			if(`${hours}:${minutes}` == prayers[i]){
				sound.play()
				break
			}
			if(prayers[i] == findClosestTime(prayers, `${hours}:${minutes}`)){
				timeLeftTexts[i].innerText = timeLeft(`${(hours <= 12 && hours != 0) ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}`, findClosestTime(prayers, `${hours}:${minutes}`, prayers[i]))
				if (timeLeftTexts[i+1] != null){
					timeLeftTexts[i+1].innerText = timeLeft(`${(hours <= 12 && hours != 0) ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}`, prayers[i+1])
				}
				
				if(cards[i+1] != null && cardiconsB[i+1] != null){
					
					if(cardiconsB[i+1].classList.contains("d-none")){
						if(cards[i+1] != null && cardiconsB[i+1] != null){
							cardiconsB[i+1].classList.remove("d-none")
						}
					}
					if(
						!cards[i+1].classList.contains("secondary-dark") && 
						!cards[i+1].classList.contains("text-white") && 
						!cards[i+1].classList.contains("float") && 
						!cards[i+1].classList.contains("delay")
					){
						
						cards[i+1].classList.add("secondary-dark")
						cards[i+1].classList.add("text-white")
						cards[i+1].classList.add("float")
						cards[i+1].classList.add("delay")
					}
				}

				if(cardiconsA[i].classList.contains("d-none")){
					if(cards[i] != null && cardiconsA[i] != null){	
						cardiconsA[i].classList.remove("d-none")
					}
				}
				if(
					!cards[i].classList.contains("secondary") && 
					!cards[i].classList.contains("text-white") && 
					!cards[i].classList.contains("float")
				){
					if(cards[i] != null && cardiconsA[i] != null){
						cards[i].classList.add("secondary")
						cards[i].classList.add("text-white")
						cards[i].classList.add("float")
					}
				}
				
			}
			if(prayers[i] != findClosestTime(prayers, `${hours}:${minutes}`)){
				if(cardiconsB[i+1] != null){
					if(
						!cardiconsB[i+1].classList.contains("d-none") &&
						cards[i+1].classList.contains("secondary-dark") &&
						cards[i+1].classList.contains("text-white") &&
						cards[i+1].classList.contains("float") &&
						cards[i+1].classList.contains("delay") 
					  )
					{
						cardiconsB[i+1].classList.add("d-none")
						cards[i+1].classList.remove("secondary-dark")
						cards[i+1].classList.remove("text-white")
						cards[i+1].classList.remove("float")
						cards[i+1].classList.remove("delay")
					}
					if(
						cardiconsA[i].classList.contains("d-none") == false &&
						cards[i].classList.contains("secondary") &&
						cards[i].classList.contains("text-white") &&
						cards[i].classList.contains("float")
					  )
					{
						cardiconsA[i].classList.add("d-none")
						cards[i].classList.remove("secondary") 
						cards[i].classList.remove("text-white") 
						cards[i].classList.remove("float")
					}
				}
			}

			if(prayers[i] < findClosestTime(prayers, `${hours}:${minutes}`)){
				if(
					cardiconsC[i].classList.contains("d-none") &&
					!cards[i].classList.contains("past")
			    )
				{
					cardiconsC[i].classList.remove("d-none")
					cards[i].classList.add("past")
				}
			}
			if(prayers[i] > findClosestTime(prayers, `${hours}:${minutes}`)){
				
				// console.log(timeLeft(`${(hours <= 12 && hours != 0) ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}`, findClosestTime(prayers, `${hours}:${minutes}`, prayers[i])))
				// timeLeftTexts[i].innerText = timeLeft(`${(hours <= 12 && hours != 0) ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}`, findClosestTime(prayers, `${hours}:${minutes}`, prayers[i]))
				
				if(
					!cardiconsC[i].classList.contains("d-none") &&
					cards[i].classList.contains("past")
				){
					cardiconsC[i].classList.add("d-none")
					cards[i].classList.remove("past")
				}


			}
		}
	}
	if((city == null || country == null) && count == 2){
		warningText.innerText = "Couldnt access location. Please give location permissions, and enable cookies!"
		alert("Couldnt access location. Please give location permissions, and enable cookies!")
	}
	else{
		warningText.innerText = " "
	}
	count += 1
}


for (let i = 0; i < 6; i++) {
	setTimeout(function() {
		step();
	}, i * 1000);
}

setInterval(()=>{
	step()
}, 1 * 60 * 1000)

setInterval(()=>{
	date = new Date()
	hours = date.getHours()
	minutes = date.getMinutes()

	daySuffix = '';
	if (day === 1 || day === 21 || day === 31) {
		daySuffix = 'st';
	} else if (day === 2 || day === 22) {
		daySuffix = 'nd';
	} else if (day === 3 || day === 23) {
		daySuffix = 'rd';
	} else {
		daySuffix = 'th';
	}

	dateText.innerText = `${day}${daySuffix} of ${months[month - 1]}, ${year}`
	timeText.innerText = `${hours <= 12 ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}`
	getDate()

	
}, 15 * 1000)


