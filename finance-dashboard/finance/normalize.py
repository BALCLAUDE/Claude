"""Turn raw statement descriptions into readable merchant names.

'SQ *BLUE BOTTLE COFFE 0123 SAN FRANCISCO CA' -> 'Blue Bottle Coffe'
'PURCHASE AUTHORIZED ON 10/12 SAFEWAY #1234 SEATTLE WA S38428' -> 'Safeway'
"""
from __future__ import annotations

import re

PREFIXES = re.compile(
    r"^(?:(?:POS|DEBIT CARD|DEBIT|CHECKCARD|CHECK CARD|VISA|PURCHASE|RECURRING|ACH|ONLINE|MOBILE|PREAUTHORIZED|PRE-AUTH)\s+)*"
    r"(?:PURCHASE\s+)?(?:AUTHORIZED ON\s+\d{1,2}/\d{1,2}\s+)?(?:\d{4}\s+)?"
    r"(?:SQ \*|SQ\*|TST\*\s?|TST \*|SP \*|SP\s|PP\*|PAYPAL \*|PAYPAL\*|PY \*|GOOGLE \*|APL\*\s?|APPLE\.COM/BILL|AMZN MKTP US\*?|DD \*|DD\*|IC\*|LYFT \*|UBER \*|BT\*|EB \*|FS \*|WPY\*|CKE\*|SMK\*)?",
    re.I,
)
US_STATES = set(("AL AK AZ AR CA CT DE FL GA IA ID IL KS KY LA MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH PA "
                  "RI SC SD TN TX UT VT VA WA WV WI WY DC").split())  # CO, IN, OR, ME, OK, HI left out: common words
NOISE = [
    re.compile(r"\s+S\d{6,}\b.*$"),            # card network auth codes
    re.compile(r"\s+CARD\s*\d{2,4}\b.*$", re.I),
    re.compile(r"\s+X{2,}\d+.*$", re.I),       # masked numbers
    re.compile(r"\s*#\s?\d+.*$"),              # store numbers
    re.compile(r"\s+\d{3,}[\d\-]*.*$"),        # trailing reference numbers
    re.compile(r"\s+(?:WWW\.)?\S+\.(?:COM|NET|ORG)(?:/\S*)?$", re.I),
    re.compile(r"\s+\d{3}-\d{3}-\d{4}.*$"),    # phone numbers
    re.compile(r"\s+(?:PPD|WEB|CCD|TEL) ID:.*$", re.I),
]
SMALL = {"and", "of", "the", "at", "for", "&"}
TRAIL_WORDS = re.compile(r"(?:\s+(?:WEB PMTS|WEB PMT|WEB ONLINE|WEB|ONLINE PMT|ONLINE|AUTO ?PAY|AUTOPAY|PMT|PAYMENT|BILL ?PAY|PPD|ACH|DEBIT|RECURRING|INC|LLC|CORP))+$")

# Well-known merchants whose statement text is messy. First match wins.
BRANDS = [(re.compile(p, re.I), n) for p, n in [
    (r"AMAZON PRIME|PRIME VIDEO", "Amazon Prime"), (r"AMZN|AMAZON", "Amazon"), (r"WHOLEFDS|WHOLE FOODS", "Whole Foods"),
    (r"TRADER JOE", "Trader Joe's"), (r"NETFLIX", "Netflix"), (r"SPOTIFY", "Spotify"), (r"HULU", "Hulu"),
    (r"DISNEY ?PLUS|DISNEYPLUS", "Disney+"), (r"YOUTUBE", "YouTube"), (r"ICLOUD|APPLE\.COM/BILL", "Apple (iCloud/apps)"),
    (r"UBER ?EATS", "Uber Eats"), (r"\bUBER\b", "Uber"), (r"\bLYFT\b", "Lyft"), (r"DOORDASH", "DoorDash"), (r"GRUBHUB", "Grubhub"),
    (r"STARBUCKS", "Starbucks"), (r"CHIPOTLE", "Chipotle"), (r"SWEETGREEN", "Sweetgreen"), (r"MCDONALD", "McDonald's"),
    (r"PG&E|PGANDE", "PG&E"), (r"COMCAST|XFINITY", "Comcast Xfinity"), (r"T-MOBILE|TMOBILE", "T-Mobile"), (r"VERIZON", "Verizon"),
    (r"AT&T|ATT\*", "AT&T"), (r"CVS", "CVS Pharmacy"), (r"WALGREENS", "Walgreens"), (r"COSTCO", "Costco"), (r"TARGET", "Target"),
    (r"WAL-?MART", "Walmart"), (r"HOME DEPOT", "Home Depot"), (r"SAFEWAY", "Safeway"), (r"KROGER", "Kroger"),
    (r"SHELL OIL|\bSHELL\b", "Shell"), (r"CHEVRON", "Chevron"), (r"EXXON", "Exxon"), (r"\bBP\b", "BP"),
    (r"DELTA AIR", "Delta Air Lines"), (r"UNITED AIR", "United Airlines"), (r"SOUTHWEST", "Southwest Airlines"),
    (r"AMERICAN AIR", "American Airlines"), (r"MARRIOTT", "Marriott"), (r"HILTON", "Hilton"), (r"AIRBNB", "Airbnb"),
    (r"VENMO", "Venmo"), (r"PAYPAL", "PayPal"), (r"GEICO", "GEICO"), (r"EQUINOX", "Equinox"), (r"PELOTON", "Peloton"),
    (r"PETCO", "Petco"), (r"\bREI\b", "REI"), (r"UNIQLO", "Uniqlo"), (r"IKEA", "IKEA"), (r"BEST BUY", "Best Buy"),
]]


def merchant(desc: str) -> str:
    for rx, name in BRANDS:
        if rx.search(desc):
            return name
    s = re.sub(r"\s+", " ", desc.upper()).strip()
    s = PREFIXES.sub("", s, count=1).strip(" *-")
    for _ in range(2):
        for rx in NOISE:
            s = rx.sub("", s)
        s = _strip_city_state(s)
        s = TRAIL_WORDS.sub("", s).strip(" *-,")
    s = s or desc.strip()
    words = s.split()
    return " ".join(w.lower() if w.lower() in SMALL and i else (w if w in KEEP_UPPER else w.capitalize())
                    for i, w in enumerate(words))[:60]


KEEP_UPPER = {"ATM", "CVS", "IKEA", "BP", "USA", "IRS", "ACH", "AT&T", "PG&E", "HSA", "IRA", "LLC", "TV", "UPS", "USPS", "DMV", "REI", "H&M", "BBQ"}


def _strip_city_state(s: str) -> str:
    """'BLUE BOTTLE COFFEE OAKLAND CA' -> 'BLUE BOTTLE COFFEE'. Drops a trailing state code (and ZIP),
    then the city: one word, or two for common two-word city prefixes, keeping at least two words."""
    words = s.split()
    if len(words) >= 2 and words[-1].isdigit() and len(words[-1]) == 5:
        words.pop()
    if len(words) >= 2 and words[-1] in US_STATES:
        words.pop()
        two = len(words) >= 4 and words[-2] in ("SAN", "SANTA", "LOS", "LAS", "NEW", "FORT", "ST", "SAINT", "EL", "PALO", "MOUNTAIN", "SALT", "LONG", "WEST", "EAST", "NORTH", "SOUTH")
        if two:
            words = words[:-2]
        elif len(words) >= 3:
            words.pop()
    return " ".join(words).strip(" *-,")
