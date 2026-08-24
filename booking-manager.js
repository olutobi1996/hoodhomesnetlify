/* ========================================
   BOOKING MANAGER
======================================== */

let bookings = [];


/* ========================================
   ELEMENTS
======================================== */

const bookingInput = document.getElementById("bookingInput");
const parseBookingsBtn = document.getElementById("parseBookingsBtn");
const bookingStatus = document.getElementById("bookingStatus");

const resultsSection = document.getElementById("resultsSection");
const bookingResults = document.getElementById("bookingResults");
const bookingCount = document.getElementById("bookingCount");

const warnings = document.getElementById("warnings");

const clearBtn = document.getElementById("clearBtn");
const calendarBtn = document.getElementById("calendarBtn");


/* ========================================
   MONTHS
======================================== */

const months = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12
};


/* ========================================
   PARSE BUTTON
======================================== */

parseBookingsBtn.addEventListener("click", parseBookings);


/* ========================================
   MAIN PARSER
======================================== */

function parseBookings() {

    const text = bookingInput.value.trim();

    if (!text) {

        bookingStatus.textContent = "Please paste the booking email first.";

        return;
    }

    bookings = [];

    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== "");

    let currentProperty = null;

    for (const line of lines) {

        /*
            Property headings in your client's email
            end with a colon.

            Example:

            Mowbray Road House:
        */

        if (line.endsWith(":")) {

            currentProperty = line
                .slice(0, -1)
                .trim();

            continue;
        }


        /*
            Ignore lines until we have a property.
        */

        if (!currentProperty) {
            continue;
        }


        /*
            Try to interpret the line as a booking.
        */

        const booking = parseDateRange(line);

        if (booking) {

            bookings.push({

                property: currentProperty,

                start: booking.start,

                end: booking.end

            });

        }

    }


    /*
        Display results.
    */

    if (bookings.length === 0) {

        bookingStatus.textContent =
            "I couldn't find any bookings.";

        resultsSection.classList.add("hidden");

        return;
    }


    bookingStatus.textContent =
        `${bookings.length} bookings found.`;

    renderBookings();

}


/* ========================================
   DATE RANGE PARSER
======================================== */

function parseDateRange(line) {

    /*
        Remove ordinal endings:

        14th → 14
        23rd → 23
        1st → 1
        2nd → 2
    */

    line = line.replace(
        /(\d+)(st|nd|rd|th)/gi,
        "$1"
    );


    /*
        Special case:

        now - 15 august
    */

    if (/^now\s*-/i.test(line)) {

        const endText = line
            .replace(/^now\s*-\s*/i, "")
            .trim();

        const end = parseSingleDate(endText);

        if (!end) {
            return null;
        }

        const today = new Date();

        return {

            start: formatDate(today),

            end: end

        };

    }


    /*
        Normal ranges:

        14-23 august
        14 - 23 august
        30 august - 2 september
    */

    const parts = line.split(/\s*-\s*/);

    if (parts.length !== 2) {
        return null;
    }

    const startText = parts[0].trim();
    const endText = parts[1].trim();


    /*
        Determine the month.
    */

    let startMonth = findMonth(startText);
    let endMonth = findMonth(endText);


    /*
        If no month is written on the first date,
        use the month written on the second date.
    */

    if (!startMonth) {
        startMonth = endMonth;
    }

    if (!endMonth) {
        endMonth = startMonth;
    }


    if (!startMonth || !endMonth) {
        return null;
    }


    const year = new Date().getFullYear();


    const startDay = extractDay(startText);
    const endDay = extractDay(endText);


    if (!startDay || !endDay) {
        return null;
    }


    const start = createDate(
        year,
        startMonth,
        startDay
    );

    const end = createDate(
        year,
        endMonth,
        endDay
    );


    /*
        If the end date is earlier than the start date,
        assume we've crossed into the next year.
    */

    if (end < start) {
        end.setFullYear(
            end.getFullYear() + 1
        );
    }


    return {

        start: formatDate(start),

        end: formatDate(end)

    };

}


/* ========================================
   FIND MONTH
======================================== */

function findMonth(text) {

    const lower = text.toLowerCase();

    for (const monthName in months) {

        if (lower.includes(monthName)) {

            return months[monthName];

        }

    }

    return null;

}


/* ========================================
   EXTRACT DAY
======================================== */

function extractDay(text) {

    const match = text.match(/\b\d{1,2}\b/);

    if (!match) {
        return null;
    }

    return Number(match[0]);

}


/* ========================================
   SINGLE DATE
======================================== */

function parseSingleDate(text) {

    const month = findMonth(text);
    const day = extractDay(text);

    if (!month || !day) {
        return null;
    }

    const year = new Date().getFullYear();

    return formatDate(
        createDate(year, month, day)
    );

}


/* ========================================
   CREATE DATE
======================================== */

function createDate(year, month, day) {

    return new Date(
        year,
        month - 1,
        day
    );

}


/* ========================================
   FORMAT DATE
======================================== */

function formatDate(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* ========================================
   DISPLAY BOOKINGS
======================================== */

function renderBookings() {

    bookingResults.innerHTML = "";

    bookings.forEach((booking, index) => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(booking.property)}
            </td>

            <td>
                ${formatDisplayDate(booking.start)}
            </td>

            <td>
                ${formatDisplayDate(booking.end)}
            </td>

            <td>

                <button
                    type="button"
                    class="delete-booking"
                    data-index="${index}"
                >
                    Remove
                </button>

            </td>

        `;


        bookingResults.appendChild(row);

    });


    bookingCount.textContent =
        `${bookings.length} ${
            bookings.length === 1
                ? "booking"
                : "bookings"
        }`;


    /*
        Add remove buttons.
    */

    document
        .querySelectorAll(".delete-booking")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    bookings.splice(
                        index,
                        1
                    );

                    renderBookings();

                }
            );

        });


    checkForOverlaps();

    resultsSection.classList.remove(
        "hidden"
    );

}


/* ========================================
   OVERLAP CHECK
======================================== */

function checkForOverlaps() {

    warnings.innerHTML = "";

    const grouped = {};


    /*
        Group bookings by property.
    */

    bookings.forEach(booking => {

        if (!grouped[booking.property]) {

            grouped[booking.property] = [];

        }

        grouped[booking.property].push(
            booking
        );

    });


    const overlapMessages = [];


    /*
        Compare bookings for each property.
    */

    for (const property in grouped) {

        const propertyBookings =
            grouped[property].sort(
                (a, b) =>
                    a.start.localeCompare(
                        b.start
                    )
            );


        for (
            let i = 1;
            i < propertyBookings.length;
            i++
        ) {

            const previous =
                propertyBookings[i - 1];

            const current =
                propertyBookings[i];


            if (
                current.start <
                previous.end
            ) {

                overlapMessages.push(
                    `${property}: ${formatDisplayDate(previous.start)} – ${formatDisplayDate(previous.end)} overlaps ${formatDisplayDate(current.start)} – ${formatDisplayDate(current.end)}`
                );

            }

        }

    }


    if (overlapMessages.length > 0) {

        warnings.innerHTML = `

            <div class="warning">

                <strong>
                    ⚠️ Possible booking overlap
                </strong>

                <br><br>

                ${overlapMessages
                    .map(escapeHTML)
                    .join("<br>")}

            </div>

        `;

    }

}


/* ========================================
   CLEAR
======================================== */

clearBtn.addEventListener(
    "click",
    () => {

        bookingInput.value = "";

        bookings = [];

        resultsSection.classList.add(
            "hidden"
        );

        warnings.innerHTML = "";

        bookingStatus.textContent =
            "Ready";

    }
);


/* ========================================
   GOOGLE CALENDAR
======================================== */

calendarBtn.addEventListener(
    "click",
    () => {

        if (bookings.length === 0) {

            return;

        }


        /*
            For now we're just showing
            what will eventually connect
            to Google Calendar.

            We'll replace this with the
            secure API connection next.
        */

        alert(
            `${bookings.length} bookings ready for Google Calendar.`
        );

    }
);


/* ========================================
   DISPLAY DATE
======================================== */

function formatDisplayDate(dateString) {

    const date =
        new Date(
            `${dateString}T12:00:00`
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ========================================
   SECURITY
======================================== */

function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}