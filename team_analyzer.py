"""
Module 2: Team Size Analyzer (team_analyzer.py)
-----------------------------------------------
Analyzes Steam store game descriptions, developer metadata, and credits to estimate
core development team size and assess whether a game qualifies as a micro-indie (<= 3 devs).
"""

import re
from typing import Dict, Any, List, Tuple


class TeamAnalysisResult:
    def __init__(
        self,
        team_size: int,
        confidence: str,  # 'High', 'Medium', 'Low'
        evidence: List[str],
        is_micro: bool,
        notes: str = ""
    ):
        self.team_size = team_size
        self.confidence = confidence
        self.evidence = evidence
        self.is_micro = is_micro
        self.notes = notes

    def to_dict(self) -> Dict[str, Any]:
        return {
            "team_size": self.team_size,
            "confidence": self.confidence,
            "evidence": self.evidence,
            "is_micro": self.is_micro,
            "notes": self.notes
        }


# Known famous solo / micro developer knowledge base
KNOWN_CREATORS_DB: Dict[str, Tuple[int, str]] = {
    "localthunk": (1, "Verified: Solo developer of Balatro"),
    "zeekerss": (1, "Verified: Solo developer of Lethal Company"),
    "mike klubnika": (1, "Verified: Solo creator of Buckshot Roulette"),
    "billy basso": (1, "Verified: Solo developer of Animal Well"),
    "slavic magic": (1, "Verified: Greg Styczeń, solo core creator of Manor Lords"),
    "greg styczeń": (1, "Verified: Solo developer of Manor Lords"),
    "panna cotta": (1, "Verified: Solo developer"),
    "poncle": (1, "Verified: Luca Galante, original solo dev of Vampire Survivors"),
    "daniel mullins games": (1, "Verified: Solo visionary behind Inscryption"),
    "landfall publishing": (4, "Known studio team > 3"),
    "mrdiv": (1, "Verified: Solo developer of Voices of the Void"),
    "nosebleed interactive": (3, "Verified: 3-person indie studio"),
    "sfbaystudios": (1, "Verified: Solo developer"),
    "sad owl studios": (3, "Verified: 3-person core team for Viewfinder"),
    "puddle games": (2, "Verified: 2-person duo team"),
    "baba is you": (1, "Verified: Arvi Teikari (Hempuli) solo dev"),
    "sf bay studios": (1, "Solo creator"),
    "prikol team": (2, "2-person indie team"),
    "sfm team": (2, "2-person indie team"),
    "anas abdin": (1, "Verified: Solo pixel artist & developer"),
    "sf studios": (2, "2-person studio"),
    "tiny glade": (2, "Pounce Light (Anastasia & Tomasz, 2-person team)"),
    "pounce light": (2, "Verified: 2-person duo team (Anastasia & Tomasz)"),
    "crow country": (2, "SFB Games (Brothers Tom & Adam Vian, 2-person core)"),
    "sfb games": (2, "Verified: 2 brothers core creative team (Tom & Adam Vian)"),
    "schedule 1": (1, "Verified: Solo developer TVGS"),
    "tvgs": (1, "Verified: Solo developer"),
    "chained together": (3, "Anegar Games (3-person Turkish indie team)"),
    "anegar games": (3, "Verified: 3-person micro team"),
    "dazed games": (2, "Verified: 2-person duo team behind viral hit 'How to Fish'"),
    "lemorion_1224": (1, "Verified: Solo developer of viral hit 'MECCHA CHAMELEON'"),
    "kotake create": (1, "Verified: Solo developer Kotake behind 'The Exit 8'"),
    "playwithfurcifer": (2, "Verified: 2-person developer duo (Furcifer & Mario) behind 'Backpack Battles'"),
    "black tabby games": (2, "Verified: 2-person creative duo (Abby Howard & Tony Howard-Arias) behind 'Slay the Princess'"),
    "tour de pizza": (2, "Verified: 2-person core development duo (McPig & Sertif) behind 'Pizza Tower'"),
    "rittzler": (1, "Verified: Solo developer behind 'Pseudoregalia'"),
    "mister morris games": (1, "Verified: Solo developer Mister Morris behind 'Rusty's Retirement'"),
    "noisestorm": (1, "Verified: Solo creator Eoin O'Broin behind 'Crab Champions'"),
    "team cherry": (3, "Verified: 3-person core indie team (Ari, William, Jack)"),
    "mumpitz games": (2, "Verified: 2-person indie team behind 'Sir, We Have an Orc Problem'"),
    "artrising": (1, "Verified: Solo developer ArtRising behind 'Librarian: Tidy Up the Arcane Library!' (图书管理员：整理魔法图书馆吧！)"),
    "opneon games": (1, "Verified: Solo developer Sia Ding Shen (OPNeon Games) behind 'TCG Card Shop Simulator'"),
    "nokta games": (1, "Verified: Solo creator Yusuf Toptan (origin solo dev in Turkey) behind 'Supermarket Simulator'"),
    "doot": (2, "Verified: 2-person indie duo (Doot & Blibloop) behind 'Minami Lane'"),
    "blibloop": (2, "Verified: 2-person indie duo (Doot & Blibloop) behind 'Minami Lane'"),
}


# Regex patterns for solo developers
SOLO_PATTERNS = [
    (re.compile(r'\b(solo\s+dev(eloper)?|solo\s+project|solo\s+indie\s+dev)\b', re.IGNORECASE), "Store description explicitly mentions 'Solo Developer'"),
    (re.compile(r'\b(developed|created|made|programmed|designed)\s+by\s+(a\s+)?(single|one|1)\s+person\b', re.IGNORECASE), "Description states 'made by 1 person'"),
    (re.compile(r'\b(one-man\s+(team|show|army|project|band))\b', re.IGNORECASE), "Description states 'one-man team/show'"),
    (re.compile(r'\b(lone\s+developer|lone\s+wolf\s+dev)\b', re.IGNORECASE), "Description mentions 'lone developer'"),
    (re.compile(r'\b(i\s+am\s+(a\s+)?solo\s+developer|i\s+made\s+this\s+game\s+(by\s+myself|alone))\b', re.IGNORECASE), "Creator first-person statement: 'I made this game alone'"),
    (re.compile(r'\b(developed\s+entirely\s+by\s+one\s+developer)\b', re.IGNORECASE), "Explicit 'developed entirely by one developer'"),
    (re.compile(r'(单人开发|独立单人|一人独立研发|个人独立制作|一人制作)', re.IGNORECASE), "中文描述明确标明单人开发"),
]

# Regex patterns for 2-person teams
DUO_PATTERNS = [
    (re.compile(r'\b(team\s+of\s+(two|2)|made\s+by\s+(two|2)\s+(people|friends|developers|devs|brothers|sisters))\b', re.IGNORECASE), "Description mentions 'team of 2 / two friends'"),
    (re.compile(r'\b(duo\s+team|two-person\s+team|two\s+person\s+studio|two-man\s+team)\b', re.IGNORECASE), "Description states 'duo / two-person team'"),
    (re.compile(r'\b(developed\s+by\s+(two|2)\s+people)\b', re.IGNORECASE), "Description states 'developed by two people'"),
    (re.compile(r'(双人开发|两人团队|2人独立团队|二人制作)', re.IGNORECASE), "中文描述标明双人团队"),
]

# Regex patterns for 3-person teams
TRIO_PATTERNS = [
    (re.compile(r'\b(team\s+of\s+(three|3)|made\s+by\s+(three|3)\s+(people|friends|developers|devs))\b', re.IGNORECASE), "Description mentions 'team of 3 / three friends'"),
    (re.compile(r'\b(trio\s+team|three-person\s+team|three\s+person\s+studio|three-man\s+team)\b', re.IGNORECASE), "Description states 'three-person team'"),
    (re.compile(r'(三人开发|三人团队|3人独立团队|三人制作)', re.IGNORECASE), "中文描述标明三人团队"),
]

# Regex patterns for general small/large teams
TEAM_SIZE_NUM_PATTERN = re.compile(
    r'\b(?:team\s+of|developed\s+by|made\s+by|group\s+of)\s+(\d{1,2})\s+(?:people|developers|devs|passionate\s+gamers|friends|creators)\b',
    re.IGNORECASE
)


class TeamAnalyzer:
    """Intelligent team size analysis combining metadata, known DB, and text mining."""

    @staticmethod
    def clean_html(raw_html: str) -> str:
        """Strip HTML tags and convert entities for regex scanning."""
        if not raw_html:
            return ""
        text = re.sub(r'<[^>]+>', ' ', raw_html)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    @classmethod
    def analyze(
        cls,
        developers: List[str] or str,
        publishers: List[str] or str,
        description: str,
        detailed_description: str = "",
        override_team_size: int = None
    ) -> TeamAnalysisResult:
        """
        Analyze game development team size.
        Returns a TeamAnalysisResult object.
        """
        if override_team_size is not None and override_team_size > 0:
            return TeamAnalysisResult(
                team_size=override_team_size,
                confidence="High",
                evidence=["Explicit manual / verified override"],
                is_micro=override_team_size <= 3,
                notes="Manual verification"
            )

        # Normalize developers
        if isinstance(developers, str):
            dev_list = [d.strip() for d in re.split(r'[,;/&]| and ', developers) if d.strip()]
            dev_raw = developers
        else:
            dev_list = developers or []
            dev_raw = ", ".join(dev_list)

        dev_raw_lower = dev_raw.lower()
        combined_text = f"{description} {detailed_description}"
        cleaned_text = cls.clean_html(combined_text)

        evidence: List[str] = []
        team_size = 1
        confidence = "Low"

        # 1. Check known creators database
        for known_key, (k_size, k_evidence) in KNOWN_CREATORS_DB.items():
            if known_key in dev_raw_lower or known_key in cleaned_text.lower():
                return TeamAnalysisResult(
                    team_size=k_size,
                    confidence="High",
                    evidence=[f"Known Creator DB: {k_evidence}"],
                    is_micro=k_size <= 3,
                    notes=f"Matched known creator '{known_key}'"
                )

        # 2. Check Solo patterns in text
        for pattern, ev_text in SOLO_PATTERNS:
            match = pattern.search(cleaned_text)
            if match:
                snippet = match.group(0)
                evidence.append(f"{ev_text} (匹配片断: '{snippet}')")
                return TeamAnalysisResult(
                    team_size=1,
                    confidence="High",
                    evidence=evidence,
                    is_micro=True,
                    notes="Explicit solo developer claim in store text"
                )

        # 3. Check Duo patterns in text
        for pattern, ev_text in DUO_PATTERNS:
            match = pattern.search(cleaned_text)
            if match:
                snippet = match.group(0)
                evidence.append(f"{ev_text} (匹配片断: '{snippet}')")
                return TeamAnalysisResult(
                    team_size=2,
                    confidence="High",
                    evidence=evidence,
                    is_micro=True,
                    notes="Explicit 2-person team claim in store text"
                )

        # 4. Check Trio patterns in text
        for pattern, ev_text in TRIO_PATTERNS:
            match = pattern.search(cleaned_text)
            if match:
                snippet = match.group(0)
                evidence.append(f"{ev_text} (匹配片断: '{snippet}')")
                return TeamAnalysisResult(
                    team_size=3,
                    confidence="High",
                    evidence=evidence,
                    is_micro=True,
                    notes="Explicit 3-person team claim in store text"
                )

        # 5. Check numeric team size in text (e.g. "team of 4")
        num_match = TEAM_SIZE_NUM_PATTERN.search(cleaned_text)
        if num_match:
            try:
                detected_size = int(num_match.group(1))
                snippet = num_match.group(0)
                evidence.append(f"Store description stated: '{snippet}'")
                return TeamAnalysisResult(
                    team_size=detected_size,
                    confidence="High" if detected_size <= 10 else "Medium",
                    evidence=evidence,
                    is_micro=detected_size <= 3,
                    notes=f"Detected team size of {detected_size}"
                )
            except ValueError:
                pass

        # 6. Heuristics based on developer field
        num_dev_entries = len(dev_list)
        if num_dev_entries == 1:
            dev_name = dev_list[0]
            # If developer name looks like a personal name (e.g. "John Smith", "Mike Klubnika")
            words = dev_name.split()
            studio_keywords = ["studio", "studios", "games", "interactive", "entertainment", "soft", "tech", "team", "works"]
            has_studio_word = any(kw in dev_name.lower() for kw in studio_keywords)

            if not has_studio_word and len(words) in (1, 2, 3):
                team_size = 1
                confidence = "Medium"
                evidence.append(f"Developer field single individual name: '{dev_name}'")
            else:
                team_size = 1 if not has_studio_word else 2
                confidence = "Medium"
                evidence.append(f"Single developer entity listed: '{dev_name}' (Estimated micro studio)")
        elif num_dev_entries in (2, 3):
            team_size = num_dev_entries
            confidence = "Medium"
            evidence.append(f"Developer field lists {num_dev_entries} distinct individuals/entities: {', '.join(dev_list)}")
        else:
            team_size = max(num_dev_entries, 4)
            confidence = "Low"
            evidence.append(f"Multiple developers listed ({num_dev_entries} entities)")

        # Check for first-person singular pronouns in description (e.g. "I spent 3 years", "My goal")
        first_person_match = re.search(r'\b(i\s+started\s+developing|i\s+spent|i\s+wanted\s+to\s+create|my\s+first\s+game|as\s+a\s+solo)\b', cleaned_text, re.IGNORECASE)
        if first_person_match:
            team_size = 1
            confidence = "High" if confidence == "Medium" else "Medium"
            evidence.append(f"First-person creator narrative: '{first_person_match.group(0)}'")

        is_micro = team_size <= 3
        return TeamAnalysisResult(
            team_size=team_size,
            confidence=confidence,
            evidence=evidence,
            is_micro=is_micro,
            notes=f"Estimated {team_size} core dev(s)"
        )


if __name__ == "__main__":
    # Self-test sample
    print("--- Running Team Analyzer Self-Test ---")
    samples = [
        ("LocalThunk", "Playstack", "Balatro is a poker roguelike. Solo developer LocalThunk built it."),
        ("Zeekerss", "Zeekerss", "Lethal Company is a co-op horror game by solo developer Zeekerss."),
        ("SFB Games", "SFB Games", "Created by SFB Games, a small duo team of two brothers Tom and Adam Vian."),
        ("Anegar Games", "Anegar Games", "A 3-person indie developer team from Turkey created Chained Together."),
        ("Random Studio Inc", "Publisher", "A massive 50-person studio created this open world RPG.")
    ]

    for dev, pub, desc in samples:
        res = TeamAnalyzer.analyze(dev, pub, desc)
        print(f"Dev: {dev} -> Team Size: {res.team_size}, Conf: {res.confidence}, Micro: {res.is_micro}")
        print(f"  Evidence: {res.evidence}\n")
