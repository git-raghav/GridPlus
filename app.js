const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); // for PUT and DELETE requests
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const meters = require("./routes/meter.js"); // importing the listing routes
const alerts = require("./routes/alert.js"); // importing the review routes
const Meter = require("./models/meter.js"); // importing the Meter model
const Alert = require("./models/alert.js"); // importing the Meter model

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // using ejsMate for layout support in EJS

/* -------------------------- connecting to MongoDB ------------------------- */
const MONGO_URL = "mongodb://127.0.0.1:27017/gridplus";
main()
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
	res.send("Hi Iam Root");
});

// routes
/* ---------------------- route to render all meters ---------------------- */
app.get("/meters", async (req, res) => {
	const allMeters = await Meter.find({});
	// console.log(allMeters);
	res.render("meters/index.ejs", { allMeters });
});

/* ------------ route to render the form to register a new meter ------------ */
app.get("/meters/new", (req, res) => {
	res.render("meters/new.ejs");
});

app.get("/meters/alerts", async (req, res) => {
    const allAlerts = await Alert.find({});
    // console.log(allAlerts);
    res.render("meters/alert.ejs", { allAlerts });
});

/* ------------------- register a new meter to the database and redirects to the all meters page ------------------- */
app.post("/meters", async (req, res) => {
	try {
		const { name, location } = req.body.listing;

		// Generate 5 readings for each parameter
		const current = generateFiveReadings(0, 14);
		const voltage = generateFiveReadings(215, 240, false);
		const powerFactor = generateFiveReadings(0.3, 1, true, 2);
		const temperature = generateFiveReadings(-15, 65, false);
		const load = current.map((c, i) => parseFloat((c * voltage[i] * powerFactor[i]).toFixed(2)));

		// 5 corresponding timestamps
		const updatedAt = Array.from({ length: 5 }, () => new Date());

		// Latest reading (for threshold check)
		const latest = {
			current: current[4],
			voltage: voltage[4],
			powerFactor: powerFactor[4],
			temperature: temperature[4],
			load: load[4],
		};

		// Thresholds
		const thresholds = {
			current: { min: 1, max: 13 },
			voltage: { min: 220, max: 240 },
			powerFactor: { min: 0.4, max: 1 },
			temperature: { min: -10, max: 60 },
			load: { min: 0, max: 3400 },
		};

		let status = "Healthy";
		let alertCount = 0;
		const alertReasons = [];

		if (latest.current < thresholds.current.min || latest.current > thresholds.current.max) {
			alertCount++;
			alertReasons.push(`Current ${latest.current}A out of range (${thresholds.current.min}-${thresholds.current.max})`);
		}
		if (latest.voltage < thresholds.voltage.min || latest.voltage > thresholds.voltage.max) {
			alertCount++;
			alertReasons.push(`Voltage ${latest.voltage}V out of range (${thresholds.voltage.min}-${thresholds.voltage.max})`);
		}
		if (latest.powerFactor < thresholds.powerFactor.min || latest.powerFactor > thresholds.powerFactor.max) {
			alertCount++;
			alertReasons.push(
				`Power Factor ${latest.powerFactor} out of range (${thresholds.powerFactor.min}-${thresholds.powerFactor.max})`
			);
		}
		if (latest.temperature < thresholds.temperature.min || latest.temperature > thresholds.temperature.max) {
			alertCount++;
			alertReasons.push(
				`Temperature ${latest.temperature}°C out of range (${thresholds.temperature.min}-${thresholds.temperature.max})`
			);
		}
		if (latest.load < thresholds.load.min || latest.load > thresholds.load.max) {
			alertCount++;
			alertReasons.push(`Load ${latest.load}W out of range (${thresholds.load.min}-${thresholds.load.max})`);
		}

		if (alertCount > 0) {
			status = "Alert";
		}

		const newMeter = new Meter({
			name,
			location,
			current,
			voltage,
			powerFactor,
			temperature,
			load,
			updatedAt,
			status,
			alertCount,
			alerts: [],
		});
		await newMeter.save();

		// Create alerts for threshold violations
		if (status === "Alert") {
			for (let reason of alertReasons) {
				const alert = await Alert.create({
					name: name,
					current: latest.current,
					voltage: latest.voltage,
					powerFactor: latest.powerFactor,
					temperature: latest.temperature,
					load: latest.load,
					reason,
				});
				newMeter.alerts.push(alert._id);
			}
			await newMeter.save();
		}

		res.redirect("/meters");
	} catch (err) {
		console.error("Error creating meter:", err);
		res.status(500).send("Something went wrong while registering the meter.");
	}
});

// Helper function
function generateFiveReadings(min, max, isFloat = true, decimal = 2) {
	const readings = [];
	for (let i = 0; i < 5; i++) {
		let value = Math.random() * (max - min) + min;
		readings.push(isFloat ? parseFloat(value.toFixed(decimal)) : Math.floor(value));
	}
	return readings;
}

/* ----- route to render a particular meter details (using id) user clicked on ---- */
app.get("/meters/:id", async (req, res) => {
	let { id } = req.params;
	const meter = await Meter.findById(id).populate("alerts");
	// console.log(meter);
	res.render("meters/show.ejs", { meter });
});

/* --------------------------------------------------------- gets a form to edit a meter -------------------------------------------------------- */
app.get("/meters/:id/edit", async (req, res) => {
        let { id } = req.params;
        const meter = await Meter.findById(id);
        // console.log(meter);
        res.render("meters/edit.ejs", { meter });
    });


/* ---------------------------------- deletes a meter from the database and redirects to the all meters page ---------------------------------- */
app.delete("/meters/:id", async (req, res) => {
	let { id } = req.params;
	await Meter.findByIdAndDelete(id);
	res.redirect("/meters");
});







// if no above route matches, this middleware will be called
// app.all("*", (req, res, next) => {
// 	next(new ExpressError(404, "Page Not Found"));
// });

// Custom error handling middleware jo saare errors ko handle karega
// app.use((err, req, res, next) => {
// 	let { statusCode = 500, message = "Something went wrong" } = err;
// 	res.render("error.ejs", { statusCode, message });
// });

const port = 3000;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
