const API_BASE = "http://localhost:3000";
let ticketCost = 0;
let userSelectedSeats = [];
let databaseOccupiedSeats = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchApplicationState();
    document.getElementById("booking-form").addEventListener("submit", processFormSubmission);
});

// Asynchronous Integration Layer
async function fetchApplicationState() {
    toggleLoadingIndicators(true);
    try {
        const [eventResponse, bookingsResponse] = await Promise.all([
            fetch(`${API_BASE}/event`),
            fetch(`${API_BASE}/bookings`)
        ]);

        if (!eventResponse.ok || !bookingsResponse.ok) {
            throw new Error("HTTP Status Code Verification failed on server load.");
        }

        const eventConfig = await eventResponse.json();
        const globalBookings = await bookingsResponse.json();

        ticketCost = eventConfig.pricePerSeat;
        document.getElementById("event-title").innerText = `✨ ${eventConfig.title} ✨`;
        
        databaseOccupiedSeats = globalBookings.flatMap(b => b.seats);
        renderResponsiveMatrixChart();
        toggleLoadingIndicators(false);
    } catch (err) {
        console.error("Critical Exception caught: ", err);
        toggleLoadingIndicators(false);
        document.getElementById("error-state").classList.remove("d-none");
        document.getElementById("main-content-row").classList.add("d-none");
    }
}

// Draw Seating Components
function renderResponsiveMatrixChart() {
    const matrixGrid = document.getElementById("seating-grid");
    matrixGrid.innerHTML = "";
    
    const rows = ["A", "B", "C", "D", "E"];
    const layoutColumns = 6;

    rows.forEach(rowCode => {
        const structuralRow = document.createElement("div");
        structuralRow.className = "seat-row";

        const alphabetMarker = document.createElement("span");
        alphabetMarker.className = "row-label";
        alphabetMarker.innerText = rowCode;
        structuralRow.appendChild(alphabetMarker);

        for (let colIdx = 1; colIdx <= layoutColumns; colIdx++) {
            const calculatedSeatId = `${rowCode}${colIdx}`;
            const seatSelectorElement = document.createElement("button");
            seatSelectorElement.type = "button";
            seatSelectorElement.className = "seat";
            seatSelectorElement.innerText = colIdx;

            if (databaseOccupiedSeats.includes(calculatedSeatId)) {
                seatSelectorElement.classList.add("occupied");
                seatSelectorElement.disabled = true;
            } else {
                seatSelectorElement.addEventListener("click", () => {
                    handleSeatStateTrigger(seatSelectorElement, calculatedSeatId);
                });
            }

            structuralRow.appendChild(seatSelectorElement);
        }
        matrixGrid.appendChild(structuralRow);
    });
}

function handleSeatStateTrigger(element, id) {
    if (element.classList.contains("selected")) {
        element.classList.remove("selected");
        userSelectedSeats = userSelectedSeats.filter(sId => sId !== id);
    } else {
        element.classList.add("selected");
        userSelectedSeats.push(id);
    }
    
    document.getElementById("custSeats").value = userSelectedSeats.join(", ");
    document.getElementById("total-bill").innerText = `$${userSelectedSeats.length * ticketCost}`;
    
    // Auto-clear validation error if seat is selected
    if(userSelectedSeats.length > 0) {
        document.getElementById("err-seats").style.display = "none";
    }
}

// Custom Form Validation Strategy
function processFormSubmission(e) {
    e.preventDefault(); // Lock native request lifecycle mechanisms
    
    let isFormValid = true;
    
    const nameVal = document.getElementById("custName").value.trim();
    const emailVal = document.getElementById("custEmail").value.trim();
    const phoneVal = document.getElementById("custPhone").value.trim();
    const notesVal = document.getElementById("custNotes").value;

    // Field Validation Checks
    if (!nameVal) {
        document.getElementById("err-name").style.display = "block";
        isFormValid = false;
    } else {
        document.getElementById("err-name").style.display = "none";
    }

    if (!emailVal || !emailVal.includes("@")) {
        document.getElementById("err-email").style.display = "block";
        isFormValid = false;
    } else {
        document.getElementById("err-email").style.display = "none";
    }

    if (!phoneVal) {
        document.getElementById("err-phone").style.display = "block";
        isFormValid = false;
    } else {
        document.getElementById("err-phone").style.display = "none";
    }

    if (userSelectedSeats.length === 0) {
        document.getElementById("err-seats").style.display = "block";
        isFormValid = false;
    } else {
        document.getElementById("err-seats").style.display = "none";
    }

    if (!isFormValid) return; // Terminate execution securely if inputs fail validation

    executePostPayload({
        customerName: nameVal,
        email: emailVal,
        phone: phoneVal,
        seats: userSelectedSeats,
        notes: notesVal,
        totalPaid: userSelectedSeats.length * ticketCost,
        timestamp: new Date().toISOString()
    });
}

// Persistent Asynchronous Data Operations
async function executePostPayload(bookingObject) {
    try {
        const response = await fetch(`${API_BASE}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingObject)
        });

        if (!response.ok) throw new Error("Posting transactions rejected by backend.");

        document.getElementById("booking-form").reset();
        userSelectedSeats = [];
        
        const bannerSuccess = document.getElementById("booking-success");
        bannerSuccess.classList.remove("d-none");
        setTimeout(() => bannerSuccess.classList.add("d-none"), 4000);

        await fetchApplicationState(); // Automatically re-renders the seating chart view
    } catch (err) {
        console.error("Submission failed:", err);
    }
}

function toggleLoadingIndicators(show) {
    const loadingBlock = document.getElementById("loading-state");
    if (show) loadingBlock.classList.remove("d-none");
    else loadingBlock.classList.add("d-none");
}