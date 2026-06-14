const API_BASE = "http://localhost:3000";
let localBookingsCache = [];
let maxCapacityValue = 0;
let modalControlReference = null;

document.addEventListener("DOMContentLoaded", () => {
    modalControlReference = new bootstrap.Modal(document.getElementById('editModal'));
    fetchManagementLedger();
    
    document.getElementById("edit-form").addEventListener("submit", processUpdateTransaction);
});

// Primary Management Fetch Operation
async function fetchManagementLedger() {
    try {
        const [eventRes, bookingsRes] = await Promise.all([
            fetch(`${API_BASE}/event`),
            fetch(`${API_BASE}/bookings`)
        ]);

        if (!eventRes.ok || !bookingsRes.ok) throw new Error("Faulty pipeline connections.");

        const eventConfig = await eventRes.json();
        localBookingsCache = await bookingsRes.json();
        maxCapacityValue = eventConfig.totalCapacity;

        renderCalculatedMetrics();
        renderAdministrativeTableRecords();
    } catch (err) {
        console.error("Administrative compilation error:", err);
    }
}

// Quantitative Aggregate Metric Calculations (At least 3 Stats)
function renderCalculatedMetrics() {
    const grossRevenue = localBookingsCache.reduce((sum, b) => sum + Number(b.totalPaid || 0), 0);
    const allocatedSeatsCount = localBookingsCache.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);
    const leftoverSeats = Math.max(0, maxCapacityValue - allocatedSeatsCount);

    document.getElementById("stat-revenue").innerText = `$${grossRevenue}`;
    document.getElementById("stat-seats").innerText = allocatedSeatsCount;
    document.getElementById("stat-capacity").innerText = leftoverSeats;
}

// Build Management Data Grid
function renderAdministrativeTableRecords() {
    const tableBody = document.getElementById("admin-table-body");
    tableBody.innerHTML = "";

    if (localBookingsCache.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No client records found.</td></tr>`;
        return;
    }

    localBookingsCache.forEach(booking => {
        const structuralRow = document.createElement("tr");

        structuralRow.innerHTML = `
            <td class="fw-bold">${booking.customerName}</td>
            <td>${booking.email}</td>
            <td><span class="badge bg-purple text-dark fw-bold border" style="background:#f3e5f5;">${booking.seats.join(", ")}</span></td>
            <td class="small text-muted">${booking.notes || 'Standard'}</td>
            <td class="fw-bold text-success">$${booking.totalPaid}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2 px-3 rounded-pill" onclick="initiateEditAction('${booking.id}')">
                    <i class="fa-solid fa-pen-to-square"></i> Modify
                </button>
                <button class="btn btn-sm btn-outline-danger px-3 rounded-pill" onclick="executeDeleteLifecycle('${booking.id}')">
                    <i class="fa-solid fa-trash-can"></i> Cancel
                </button>
            </td>
        `;
        tableBody.appendChild(structuralRow);
    });
}

// Initialize Update Workflow via Modal Form Insertion
function initiateEditAction(id) {
    const targetedRecord = localBookingsCache.find(b => String(b.id) === String(id));
    if (!targetedRecord) return;

    document.getElementById("edit-booking-id").value = targetedRecord.id;
    document.getElementById("edit-name").value = targetedRecord.customerName;
    document.getElementById("edit-email").value = targetedRecord.email;
    document.getElementById("edit-notes").value = targetedRecord.notes;

    modalControlReference.show();
}

// Update Operations Processing via PUT/PATCH Integration
async function processUpdateTransaction(e) {
    e.preventDefault();
    
    const targetId = document.getElementById("edit-booking-id").value;
    const modifiedName = document.getElementById("edit-name").value.trim();
    const modifiedEmail = document.getElementById("edit-email").value.trim();
    const modifiedNotes = document.getElementById("edit-notes").value;

    const patches = {
        customerName: modifiedName,
        email: modifiedEmail,
        notes: modifiedNotes
    };

    try {
        const response = await fetch(`${API_BASE}/bookings/${targetId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patches)
        });

        if (!response.ok) throw new Error("Server modifications rejected.");

        modalControlReference.hide();
        await fetchManagementLedger(); // Refresh display with new values
    } catch (err) {
        console.error("Modification pipeline failure:", err);
    }
}

// Destructive Record Purge Handler Route
async function executeDeleteLifecycle(id) {
    const confirmationConsent = confirm("Are you certain you wish to completely remove this booking record? 🔮");
    if (!confirmationConsent) return;

    try {
        const response = await fetch(`${API_BASE}/bookings/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Purge operations rejected by server.");

        await fetchManagementLedger(); // Refresh dashboard state
    } catch (err) {
        console.error("Deletion transaction dropped:", err);
    }
}