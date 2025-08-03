import React, { useState, useEffect, createContext, useContext } from 'react';

//++++++++++++ ICONS (SVG) ++++++++++++
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg> );
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg> );
const FilterIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg> );
const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg> );
const InfoIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> );
const SortIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" /></svg> );
const SparkleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 3L9.5 8.5L4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z" /><path d="M5 3v4" /><path d="M19 3v4" /><path d="M3 19h4" /><path d="M17 19h4" /></svg> );
const ExternalLinkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> );

//++++++++++++ DATE & TIME HELPERS ++++++++++++
const getEaster = (year) => {
    const f = Math.floor, G = year % 19, C = f(year / 100), H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30, I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)), J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7, L = I - J, month = 3 + f((L + 40) / 44), day = L + 28 - 31 * f(month / 4);
    return new Date(year, month - 1, day);
};

const isSundayOrHoliday = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    const year = date.getFullYear();
    if (date.getDay() === 0) return true;

    const holidays = [ new Date(year, 0, 1), new Date(year, 3, 27), new Date(year, 11, 25), new Date(year, 11, 26) ];
    const easter = getEaster(year);
    holidays.push(easter, new Date(easter.valueOf()).setDate(easter.getDate() + 1), new Date(easter.valueOf()).setDate(easter.getDate() + 39), new Date(easter.valueOf()).setDate(easter.getDate() + 49), new Date(easter.valueOf()).setDate(easter.getDate() + 50));
    return holidays.some(holiday => new Date(holiday).toDateString() === date.toDateString());
};

const calculateNachturen = (startTijd, eindTijd) => {
    let [startHour, startMinute] = startTijd.split(':').map(Number);
    let [eindHour, eindMinute] = eindTijd.split(':').map(Number);
    let start = startHour + startMinute / 60, end = eindHour + eindMinute / 60;
    if (end < start) end += 24;
    let nachtUren = 0;
    nachtUren += Math.max(0, Math.min(end, 6) - Math.max(start, 0));
    nachtUren += Math.max(0, Math.min(end, 24) - Math.max(start, 22));
    if (end > 24) { nachtUren += Math.max(0, Math.min(end - 24, 6) - 0); }
    return nachtUren;
};

const formatTime = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${String(hours % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

//++++++++++++ AUTHENTICATION & DATA CONTEXT ++++++++++++
const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState(null);
    const [calculations, setCalculations] = useState([]);
    const [history, setHistory] = useState({ projectnamen: [], projectnummers: [], opdrachtgevers: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('facturatie_tool_user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                const storedSettings = localStorage.getItem(`facturatie_tool_settings_${parsedUser.email}`);
                if(storedSettings) setSettings(JSON.parse(storedSettings));
                const storedCalculations = localStorage.getItem(`facturatie_tool_calculations_${parsedUser.email}`);
                if(storedCalculations) setCalculations(JSON.parse(storedCalculations));
                const storedHistory = localStorage.getItem(`facturatie_tool_history_${parsedUser.email}`);
                if(storedHistory) setHistory(JSON.parse(storedHistory));
            }
        } catch (error) { console.error("Failed to parse data from localStorage", error); } 
        finally { setLoading(false); }
    }, []);

    const login = (email) => {
        const newUser = { email };
        setUser(newUser);
        localStorage.setItem('facturatie_tool_user', JSON.stringify(newUser));
        const storedSettings = localStorage.getItem(`facturatie_tool_settings_${email}`);
        if(storedSettings) setSettings(JSON.parse(storedSettings)); else setSettings({ dagtarief: '400', functie: '', bedrijfsnaam: '', kmvergoeding: '0.23', basisUrenDag: '10' });
        const storedCalculations = localStorage.getItem(`facturatie_tool_calculations_${email}`);
        if(storedCalculations) setCalculations(JSON.parse(storedCalculations)); else setCalculations([]);
        const storedHistory = localStorage.getItem(`facturatie_tool_history_${email}`);
        if(storedHistory) setHistory(JSON.parse(storedHistory)); else setHistory({ projectnamen: [], projectnummers: [], opdrachtgevers: [] });
    };

    const logout = () => {
        setUser(null); setSettings(null); setCalculations([]);
        localStorage.removeItem('facturatie_tool_user');
    };

    const saveSettings = (newSettings) => {
        setSettings(newSettings);
        if (user) { localStorage.setItem(`facturatie_tool_settings_${user.email}`, JSON.stringify(newSettings)); }
    };

    const updateHistory = (calcData) => {
        const newHistory = {...history};
        if (calcData.projectnaam && !newHistory.projectnamen.includes(calcData.projectnaam)) {
            newHistory.projectnamen.push(calcData.projectnaam);
        }
        if (calcData.projectnummer && !newHistory.projectnummers.includes(calcData.projectnummer)) {
            newHistory.projectnummers.push(calcData.projectnummer);
        }
        if (calcData.opdrachtgever && !newHistory.opdrachtgevers.includes(calcData.opdrachtgever)) {
            newHistory.opdrachtgevers.push(calcData.opdrachtgever);
        }
        setHistory(newHistory);
        if(user) {
            localStorage.setItem(`facturatie_tool_history_${user.email}`, JSON.stringify(newHistory));
        }
    };

    const addCalculation = (newCalculation) => {
        const updatedCalculations = [...calculations, { ...newCalculation, id: Date.now() }];
        setCalculations(updatedCalculations);
        if (user) { 
            localStorage.setItem(`facturatie_tool_calculations_${user.email}`, JSON.stringify(updatedCalculations)); 
            updateHistory(newCalculation);
        }
    };

    const updateCalculation = (updatedCalc) => {
        const updatedCalculations = calculations.map(calc => calc.id === updatedCalc.id ? updatedCalc : calc);
        setCalculations(updatedCalculations);
        if (user) { 
            localStorage.setItem(`facturatie_tool_calculations_${user.email}`, JSON.stringify(updatedCalculations));
            updateHistory(updatedCalc);
        }
    };

    const value = { user, settings, calculations, history, login, logout, saveSettings, addCalculation, updateCalculation, loading };
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

//++++++++++++ CALCULATION LOGIC ++++++++++++
const calculateInvoice = (data, settings) => {
    const dagtarief = parseFloat(data.dagtarief) || 0;
    const basisUrenDag = parseFloat(settings?.basisUrenDag) || 10;
    const uurtarief = dagtarief > 0 ? dagtarief / basisUrenDag : 0;
    let totalBreakdown = [];
    let grandTotal = 0;

    const sortedDays = [...data.days].sort((a, b) => new Date(a.datum) - new Date(b.datum));

    sortedDays.forEach((day) => {
        let dayBreakdown = [];
        let dayTotal = 0;
        const [startHours, startMinutes] = day.startTijd.split(':').map(Number);
        const startTotalHours = startHours + startMinutes / 60;
        const [eindHours, eindMinutes] = day.eindTijd.split(':').map(Number);
        let eindTotalHours = eindHours + eindMinutes / 60;
        if (eindTotalHours < startTotalHours) eindTotalHours += 24;
        
        let gewerkteUrenFloat = eindTotalHours - startTotalHours;
        const gewerkteUren = Math.round(gewerkteUrenFloat * 4) / 4;

        if (day.isPerUur) {
            const basisBedrag = gewerkteUren * uurtarief;
            dayTotal += basisBedrag;
            dayBreakdown.push({ omschrijving: `Werkuren (${gewerkteUren.toFixed(2)}u à €${uurtarief.toFixed(2)})`, bedrag: basisBedrag });
        } else if (day.isReisdag) {
            const reisdagUren = gewerkteUren;
            if (reisdagUren <= 5) {
                const reisdagBedrag = reisdagUren * (uurtarief * 0.75);
                dayTotal += reisdagBedrag;
                dayBreakdown.push({ omschrijving: `Reisdag (${reisdagUren.toFixed(2)} uur à 75%)`, bedrag: reisdagBedrag });
            } else {
                const reisdagBedrag = dagtarief * 0.5;
                dayTotal += reisdagBedrag;
                dayBreakdown.push({ omschrijving: `Reisdag (> 5 uur)`, bedrag: reisdagBedrag });
            }
        } else {
            const isHoliday = isSundayOrHoliday(day.datum);
            if (gewerkteUren <= 6) {
                const basisBedrag = dagtarief * 0.75;
                dayTotal += basisBedrag;
                dayBreakdown.push({ omschrijving: `Halve dag`, bedrag: basisBedrag });
            } else {
                const basisEindUur = startTotalHours + basisUrenDag;
                const basisBedrag = isHoliday ? dagtarief * 1.5 : dagtarief;
                dayTotal += basisBedrag;
                dayBreakdown.push({ omschrijving: `Basisdag (${isHoliday ? 'Zondag/Feestdag 150%' : '100%'}) (${day.startTijd} - ${formatTime(basisEindUur)})`, bedrag: basisBedrag });
                
                const overuren = gewerkteUren - basisUrenDag;
                if (overuren > 0) {
                    let currentOveruurStart = basisEindUur;
                    
                    const uren150 = Math.min(overuren, 4);
                    if (uren150 > 0) {
                        const uren150Eind = currentOveruurStart + uren150;
                        dayTotal += uren150 * (uurtarief * 1.5);
                        dayBreakdown.push({ omschrijving: `Overuren (${uren150.toFixed(2)}u à 150%) (${formatTime(currentOveruurStart)} - ${formatTime(uren150Eind)})`, bedrag: uren150 * (uurtarief * 1.5) });
                        currentOveruurStart = uren150Eind;
                    }

                    if (overuren > 4) {
                        const uren200 = Math.min(overuren - 4, 2);
                        if (uren200 > 0) {
                            const uren200Eind = currentOveruurStart + uren200;
                            dayTotal += uren200 * (uurtarief * 2);
                            dayBreakdown.push({ omschrijving: `Overuren (${uren200.toFixed(2)}u à 200%) (${formatTime(currentOveruurStart)} - ${formatTime(uren200Eind)})`, bedrag: uren200 * (uurtarief * 2) });
                            currentOveruurStart = uren200Eind;
                        }
                    }
                    if (overuren > 6) {
                        const uren300 = overuren - 6;
                        if (uren300 > 0) {
                            const uren300Eind = currentOveruurStart + uren300;
                            dayTotal += uren300 * (uurtarief * 3);
                            dayBreakdown.push({ omschrijving: `Overuren (${uren300.toFixed(2)}u à 300%) (${formatTime(currentOveruurStart)} - ${formatTime(uren300Eind)})`, bedrag: uren300 * (uurtarief * 3) });
                        }
                    }
                }
            }
        }
        
        if (!day.isReisdag) {
            const nachtUren = calculateNachturen(day.startTijd, day.eindTijd);
            if (nachtUren > 0) {
                const nachtToeslag = nachtUren * (uurtarief * 0.5);
                dayTotal += nachtToeslag;
                dayBreakdown.push({ omschrijving: `Nachttoeslag (${nachtUren.toFixed(2)}u à 50%)`, bedrag: nachtToeslag });
            }
        }
        
        const kilometers = parseFloat(day.kilometers) || 0;
        if (kilometers > 0) {
            const reiskosten = kilometers * (parseFloat(data.kmvergoeding) || 0);
            dayTotal += reiskosten;
            dayBreakdown.push({ omschrijving: `Reiskosten (${kilometers} km)`, bedrag: reiskosten });
        }

        day.extraOnkosten.forEach(onkost => {
            const bedrag = parseFloat(onkost.bedrag) || 0;
            if (bedrag > 0) {
                dayTotal += bedrag;
                dayBreakdown.push({ omschrijving: onkost.naam || 'Extra onkosten', bedrag: bedrag });
            }
        });

        totalBreakdown.push({ datum: day.datum, breakdown: dayBreakdown, dayTotal: dayTotal });
        grandTotal += dayTotal;
    });

    return { grandTotal, totalBreakdown };
};

//++++++++++++ UI COMPONENTS ++++++++++++
const Tooltip = ({ text, children }) => ( <div className="relative group flex items-center">{children}<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">{text}</div></div> );
const Header = () => { const { user, logout } = useContext(DataContext); return ( <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md"><div className="flex items-center gap-4"><h1 className="text-xl font-bold">Film Facturatie Tool ✨</h1><a href="https://fijn-weekend.vercel.app/FW-CP-Akkoord-2021-v1.7.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white flex items-center gap-1">Fijn Weekend Akkoord <ExternalLinkIcon /></a></div>{user && (<button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">Uitloggen</button>)}</header> ); };
const LoginScreen = () => { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const { login } = useContext(DataContext); const handleLogin = (e) => { e.preventDefault(); if (email) { login(email); } }; return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"><div className="w-full max-w-md bg-white rounded-lg shadow-md p-8"><h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inloggen</h2><form onSubmit={handleLogin}><div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">E-mailadres</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="jouw@email.com" required /></div><div className="mb-6"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Wachtwoord</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••••" required /><p className="text-xs text-gray-500">Voor deze demo is elk wachtwoord geldig.</p></div><div className="flex items-center justify-between"><button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-200">Inloggen</button></div></form></div></div> ); };

const Dashboard = ({ setCurrentView, setEditingCalculation }) => {
    const { calculations } = useContext(DataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('datum_desc');

    const handleEdit = (calc) => {
        setEditingCalculation(calc);
        setCurrentView('new_calculation');
    };

    const sortedAndFilteredCalculations = calculations
        .filter(calc => 
            calc.projectnaam.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (calc.opdrachtgever && calc.opdrachtgever.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            const firstDayA = [...a.days].sort((d1, d2) => new Date(d1.datum) - new Date(d2.datum))[0];
            const firstDayB = [...b.days].sort((d1, d2) => new Date(d1.datum) - new Date(d2.datum))[0];

            switch (filter) {
                case 'datum_asc': return new Date(firstDayA.datum) - new Date(firstDayB.datum);
                case 'project_asc': return a.projectnaam.localeCompare(b.projectnaam);
                case 'bedrag_desc': return b.result.grandTotal - a.result.grandTotal;
                case 'bedrag_asc': return a.result.grandTotal - b.result.grandTotal;
                default: return b.id - a.id; // datum_desc
            }
        });

    const getStatusClass = (status) => {
        switch (status) {
            case 'Betaald': return 'bg-green-100 text-green-800';
            case 'Verzonden': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentView('settings')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-200">Instellingen</button>
                    <button onClick={() => { setEditingCalculation(null); setCurrentView('new_calculation'); }} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200"><PlusIcon />Nieuwe Berekening</button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input type="text" placeholder="Zoek op project of opdrachtgever..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><FilterIcon /></span>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full appearance-none pl-10 pr-8 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="datum_desc">Nieuwste eerst</option>
                            <option value="datum_asc">Oudste eerst</option>
                            <option value="project_asc">Project (A-Z)</option>
                            <option value="bedrag_desc">Bedrag (Hoog-Laag)</option>
                            <option value="bedrag_asc">Bedrag (Laag-Hoog)</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">Datum</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Projectnaam</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Opdrachtgever</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-center">Dagen</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-right">Bedrag</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredCalculations.length > 0 ? (
                                sortedAndFilteredCalculations.map(calc => {
                                    const sortedDays = [...calc.days].sort((a, b) => new Date(a.datum) - new Date(b.datum));
                                    return (
                                        <tr key={calc.id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => handleEdit(calc)}>
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{new Date(sortedDays[0].datum).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                            <td className="p-3 text-sm text-gray-700 font-bold">{calc.projectnaam}</td>
                                            <td className="p-3 text-sm text-gray-700">{calc.opdrachtgever}</td>
                                            <td className="p-3 text-sm text-gray-700 text-center">{calc.days.length}</td>
                                            <td className="p-3 text-sm text-gray-700 text-right">€{calc.result.grandTotal.toFixed(2)}</td>
                                            <td className="p-3 text-sm text-gray-700 text-center">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(calc.status)}`}>{calc.status}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : ( <tr><td colSpan="6" className="p-8 text-center text-gray-500">Nog geen berekeningen gemaakt.</td></tr> )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const NumberStepper = ({ value, onChange, name, step = 1, min = 0 }) => {
    const handleStep = (direction) => {
        const currentValue = parseFloat(value) || 0;
        const newValue = direction === 'up' ? currentValue + step : Math.max(min, currentValue - step);
        onChange({ target: { name, value: newValue.toString() } });
    };

    return (
        <div className="flex items-center">
            <input 
                type="number" 
                name={name} 
                value={value} 
                onChange={onChange} 
                className="shadow-sm appearance-none border rounded-l w-full py-2 px-3 text-gray-700 text-center" 
                step={step}
                min={min}
            />
            <div className="flex flex-col border-t border-b border-r rounded-r">
                <button type="button" onClick={() => handleStep('up')} className="bg-gray-200 text-gray-600 hover:bg-gray-300 px-2 rounded-tr" style={{ lineHeight: '1rem', height: '1.25rem' }}>+</button>
                <button type="button" onClick={() => handleStep('down')} className="bg-gray-200 text-gray-600 hover:bg-gray-300 px-2 border-t rounded-br" style={{ lineHeight: '1rem', height: '1.25rem' }}>-</button>
            </div>
        </div>
    );
};


const SettingsScreen = ({ setCurrentView }) => { 
    const { settings, saveSettings } = useContext(DataContext); 
    const [formData, setFormData] = useState(settings); 
    useEffect(() => { setFormData(settings); }, [settings]); 
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); }; 
    const handleSubmit = (e) => { e.preventDefault(); saveSettings(formData); alert('Instellingen opgeslagen!'); setCurrentView('dashboard'); }; 
    if (!formData) return <div>Laden...</div>; 
    return ( 
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Instellingen</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bedrijfsnaam">Bedrijfsnaam</label><input type="text" name="bedrijfsnaam" id="bedrijfsnaam" value={formData.bedrijfsnaam} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" /></div>
                    <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="functie">Standaard Functie</label><input type="text" name="functie" id="functie" value={formData.functie} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" /></div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dagtarief">Standaard Dagtarief (€)</label>
                        <NumberStepper name="dagtarief" value={formData.dagtarief} onChange={handleChange} step={25} />
                    </div>
                    <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="basisUrenDag">Standaard basisuren per dag</label><input type="number" name="basisUrenDag" id="basisUrenDag" value={formData.basisUrenDag} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" step="1" /></div>
                    <div className="md:col-span-2"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kmvergoeding">Standaard KM Vergoeding (€)</label><input type="number" name="kmvergoeding" id="kmvergoeding" value={formData.kmvergoeding} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" step="0.01" /></div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={() => setCurrentView('dashboard')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Annuleren</button>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Opslaan</button>
                </div>
            </form>
        </div> 
    ); 
};

const CalculationForm = ({ setCurrentView, editingCalculation, setEditingCalculation }) => {
    const { settings, addCalculation, updateCalculation, history } = useContext(DataContext);
    const isEditMode = !!editingCalculation;
    
    const getInitialFormData = () => {
        if (isEditMode) {
            return editingCalculation;
        }
        return {
            projectnaam: '', projectnummer: '', opdrachtgever: '',
            dagtarief: settings?.dagtarief || '400',
            kmvergoeding: settings?.kmvergoeding || '0.23',
            days: [{ id: 1, datum: new Date().toISOString().split('T')[0], startTijd: '07:00', eindTijd: '18:30', isReisdag: false, isPerUur: false, kilometers: '', extraOnkosten: [] }],
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);
    const [aiNotes, setAiNotes] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setResult(null);
    };

    const handleDayChange = (id, e) => {
        const { name, value, type, checked } = e.target;
        const newDays = formData.days.map(day => {
            if (day.id === id) { return { ...day, [name]: type === 'checkbox' ? checked : value }; }
            return day;
        });
        setFormData(prev => ({ ...prev, days: newDays }));
        setResult(null);
    };
    
    const handleExtraOnkostenChange = (dayId, onkostId, e) => {
        const { name, value } = e.target;
        const newDays = formData.days.map(day => {
            if (day.id === dayId) {
                const newExtraOnkosten = day.extraOnkosten.map(onkost => {
                    if (onkost.id === onkostId) { return { ...onkost, [name]: value }; }
                    return onkost;
                });
                return { ...day, extraOnkosten: newExtraOnkosten };
            }
            return day;
        });
        setFormData(prev => ({ ...prev, days: newDays }));
        setResult(null);
    };

    const addExtraOnkosten = (dayId) => {
        const newDays = formData.days.map(day => {
            if (day.id === dayId) {
                const newOnkost = { id: Date.now(), naam: '', bedrag: '' };
                return { ...day, extraOnkosten: [...day.extraOnkosten, newOnkost] };
            }
            return day;
        });
        setFormData(prev => ({ ...prev, days: newDays }));
    };

    const removeExtraOnkosten = (dayId, onkostId) => {
        const newDays = formData.days.map(day => {
            if (day.id === dayId) { return { ...day, extraOnkosten: day.extraOnkosten.filter(o => o.id !== onkostId) }; }
            return day;
        });
        setFormData(prev => ({ ...prev, days: newDays }));
    };

    const addDay = () => {
        const newDay = { id: Date.now(), datum: new Date().toISOString().split('T')[0], startTijd: '07:00', eindTijd: '18:30', isReisdag: false, isPerUur: false, kilometers: '', extraOnkosten: [] };
        setFormData(prev => ({ ...prev, days: [...prev.days, newDay] }));
    };

    const removeDay = (id) => { if (formData.days.length > 1) { setFormData(prev => ({ ...prev, days: prev.days.filter(day => day.id !== id) })); } };
    
    const sortDays = () => {
        const sorted = [...formData.days].sort((a,b) => new Date(a.datum) - new Date(b.datum));
        setFormData(prev => ({...prev, days: sorted}));
    };

    const handleSubmit = (e) => { e.preventDefault(); const calculationResult = calculateInvoice(formData, settings); setResult(calculationResult); };
    
    const handleSave = () => {
        if (result) {
            const dataToSave = { ...formData, result, status: formData.status || 'Concept' };
            if (isEditMode) {
                updateCalculation(dataToSave);
                alert('Berekening bijgewerkt!');
            } else {
                addCalculation(dataToSave);
                alert('Berekening opgeslagen!');
            }
            setEditingCalculation(null);
            setCurrentView('dashboard');
        }
    };
    
    const handleAiParse = async () => {
        if (!aiNotes) { alert("Voer eerst je notities in het veld 'Snelle Notities' in."); return; }
        setIsAiLoading(true);
        setResult(null);
        const currentYear = new Date().getFullYear();

        const prompt = `Analyseer de volgende ongestructureerde notities van een freelancer. Extraheer de informatie voor de EERSTE genoemde dag en retourneer een JSON-object.
        
        Notities:
        ---
        ${aiNotes}
        ---
        
        Instructies:
        - 'projectnaam' moet de naam van het project/klant zijn.
        - 'datum' moet de datum zijn in YYYY-MM-DD formaat. Als het jaar niet is gespecificeerd, gebruik het huidige jaar: ${currentYear}.
        - 'startTijd' en 'eindTijd' moeten de factureerbare uren zijn in HH:MM (24-uurs) formaat.
        - 'kilometers' moet het totale aantal gereden kilometers zijn als een getal.
        - 'parkeerkosten' moet het bedrag aan parkeerkosten zijn als een getal.
        - Als een waarde niet expliciet wordt vermeld, laat het veld dan leeg.`;

        const schema = { type: "OBJECT", properties: { projectnaam: { type: "STRING" }, datum: { type: "STRING" }, startTijd: { type: "STRING" }, eindTijd: { type: "STRING" }, kilometers: { type: "NUMBER" }, parkeerkosten: { type: "NUMBER" } } };
        
        try {
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const payload = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);

            const responseData = await response.json();
            const text = responseData.candidates[0].content.parts[0].text;
            const parsedJson = JSON.parse(text);

            setFormData(prev => ({
                ...prev,
                projectnaam: parsedJson.projectnaam || prev.projectnaam,
                days: prev.days.map((day, index) => index === 0 ? {
                    ...day,
                    datum: parsedJson.datum || day.datum,
                    startTijd: parsedJson.startTijd || day.startTijd,
                    eindTijd: parsedJson.eindTijd || day.eindTijd,
                    kilometers: parsedJson.kilometers?.toString() || day.kilometers,
                    extraOnkosten: [
                        ...day.extraOnkosten,
                        parsedJson.parkeerkosten ? { id: Date.now() + 1, naam: 'Parkeerkosten', bedrag: parsedJson.parkeerkosten.toString() } : null
                    ].filter(Boolean)
                } : day)
            }));
            
        } catch (error) { console.error("Error parsing notes with AI:", error); alert("Er is een fout opgetreden bij het analyseren van de notities."); } 
        finally { setIsAiLoading(false); }
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{isEditMode ? 'Berekening Bewerken' : 'Nieuwe Berekening'}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {!isEditMode && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">✨ AI Notitie Analyse</h3>
                            <p className="text-sm text-gray-600 mb-4">Plak hier je ruwe notities. De AI vult de eerste dag hieronder voor je in.</p>
                            <textarea value={aiNotes} onChange={(e) => setAiNotes(e.target.value)} rows="4" className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="bv. Di 1 april - Vriendenloterij @ Scheveningen. Factureren: 5:45 - 19:45. Totaal 100km gereden. Parkeerkosten €4,75"></textarea>
                            <button type="button" onClick={handleAiParse} disabled={isAiLoading} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors duration-200 disabled:bg-purple-300">
                                {isAiLoading ? 'Analyseren...' : <><SparkleIcon /> Vul formulier in met AI</>}
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Algemene Informatie</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectnaam">Projectnaam</label><input list="projectnamen" type="text" name="projectnaam" id="projectnaam" value={formData.projectnaam} onChange={handleGeneralChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required /><datalist id="projectnamen">{history.projectnamen.map(p => <option key={p} value={p} />)}</datalist></div>
                            <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectnummer">Projectnummer/referentie</label><input list="projectnummers" type="text" name="projectnummer" id="projectnummer" value={formData.projectnummer} onChange={handleGeneralChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" /><datalist id="projectnummers">{history.projectnummers.map(p => <option key={p} value={p} />)}</datalist></div>
                            <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dagtarief">Dagtarief (€)</label><input type="number" name="dagtarief" id="dagtarief" value={formData.dagtarief} onChange={handleGeneralChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" step="0.01" required /></div>
                            <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="opdrachtgever">Opdrachtgever / Productiehuis</label><input list="opdrachtgevers" type="text" name="opdrachtgever" id="opdrachtgever" value={formData.opdrachtgever} onChange={handleGeneralChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" /><datalist id="opdrachtgevers">{history.opdrachtgevers.map(p => <option key={p} value={p} />)}</datalist></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-xl font-bold text-gray-800">Dagen</h3>
                            <button type="button" onClick={sortDays} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-lg flex items-center gap-2"><SortIcon /> Sorteer op datum</button>
                        </div>
                        <div className="space-y-6">
                            {formData.days.map((day) => (
                                <div key={day.id} className="p-4 border rounded-lg bg-gray-50 relative">
                                    {formData.days.length > 1 && ( <button type="button" onClick={() => removeDay(day.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><TrashIcon /></button> )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`datum-${day.id}`}>Datum</label><input type="date" name="datum" id={`datum-${day.id}`} value={day.datum} onChange={(e) => handleDayChange(day.id, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required /></div>
                                        <div className="flex items-end pb-1 space-x-4">
                                            <div className="flex items-center"><input id={`isPerUur-${day.id}`} name="isPerUur" type="checkbox" checked={day.isPerUur} disabled={day.isReisdag} onChange={(e) => handleDayChange(day.id, e)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50" /><label htmlFor={`isPerUur-${day.id}`} className={`ml-2 block text-sm ${day.isReisdag ? 'text-gray-400' : 'text-gray-900'}`}><Tooltip text="Negeert dag- en overurenregels. Rekent uren x uurtarief."><span className="flex items-center gap-1">Factureer per uur <InfoIcon/></span></Tooltip></label></div>
                                            <div className="flex items-center"><input id={`isReisdag-${day.id}`} name="isReisdag" type="checkbox" checked={day.isReisdag} disabled={day.isPerUur} onChange={(e) => handleDayChange(day.id, e)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50" /><label htmlFor={`isReisdag-${day.id}`} className={`ml-2 block text-sm ${day.isPerUur ? 'text-gray-400' : 'text-gray-900'}`}><Tooltip text="Past de 75% uurtarief-regel toe voor reisdagen."><span className="flex items-center gap-1">Reisdag <InfoIcon/></span></Tooltip></label></div>
                                        </div>
                                        <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`startTijd-${day.id}`}><Tooltip text="Factureerbare vertrektijd vanaf standplaats, afgerond per kwartier"><span className="flex items-center gap-1">Factureerbare 'UIT' tijd <InfoIcon/></span></Tooltip></label><input type="time" name="startTijd" id={`startTijd-${day.id}`} value={day.startTijd} onChange={(e) => handleDayChange(day.id, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" /></div>
                                        <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`eindTijd-${day.id}`}><Tooltip text="Factureerbare aankomsttijd op standplaats, afgerond per kwartier"><span className="flex items-center gap-1">Factureerbare 'THUIS' tijd <InfoIcon/></span></Tooltip></label><input type="time" name="eindTijd" id={`eindTijd-${day.id}`} value={day.eindTijd} onChange={(e) => handleDayChange(day.id, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" /></div>
                                        <div><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`kilometers-${day.id}`}>Kilometers</label><input type="number" name="kilometers" id={`kilometers-${day.id}`} value={day.kilometers} onChange={(e) => handleDayChange(day.id, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" /></div>
                                        <div className="md:col-span-2 space-y-2">
                                            {day.extraOnkosten.map(onkost => (
                                                <div key={onkost.id} className="flex items-center gap-2">
                                                    <input type="text" name="naam" placeholder="Naam onkosten (bv. Parkeren)" value={onkost.naam} onChange={(e) => handleExtraOnkostenChange(day.id, onkost.id, e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                                                    <input type="number" name="bedrag" placeholder="Bedrag" value={onkost.bedrag} onChange={(e) => handleExtraOnkostenChange(day.id, onkost.id, e)} className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700" step="1" />
                                                    <button type="button" onClick={() => removeExtraOnkosten(day.id, onkost.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                                </div>
                                            ))}
                                             <button type="button" onClick={() => addExtraOnkosten(day.id)} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"><PlusIcon /> Extra onkosten toevoegen</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addDay} className="mt-4 text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"><PlusIcon /> Dag toevoegen</button>
                        
                        <div className="mt-8 flex justify-end gap-4">
                            <button type="button" onClick={() => { setEditingCalculation(null); setCurrentView('dashboard'); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Annuleren</button>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Bereken Totaal</button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Resultaat</h3>
                        {result ? (
                            <div>
                                <div className="border-t pt-4">
                                    <h4 className="font-bold mb-2">Uitsplitsing:</h4>
                                    <div className="space-y-4 text-sm">
                                        {result.totalBreakdown.map((dayResult, index) => (
                                            <div key={index}>
                                                <p className="font-bold text-gray-700 border-b pb-1 mb-1">{new Date(dayResult.datum + 'T00:00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                                <ul className="space-y-1 pl-2">
                                                    {dayResult.breakdown.map((item, idx) => ( <li key={idx} className="flex justify-between"><span>{item.omschrijving}</span><span className="font-medium">€{item.bedrag.toFixed(2)}</span></li> ))}
                                                    <li className="flex justify-between font-bold border-t mt-1 pt-1"><span>Subtotaal Dag</span><span>€{dayResult.dayTotal.toFixed(2)}</span></li>
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-t mt-4 pt-4">
                                     <h4 className="font-bold mb-2 text-sm">Berekening gebaseerd op:</h4>
                                     <div className="text-xs text-gray-600 space-y-1">
                                        <div className="flex justify-between"><span>Dagtarief ({settings?.basisUrenDag || 10} uur):</span><span>€{parseFloat(formData.dagtarief).toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span>Uurtarief (1/{settings?.basisUrenDag || 10}):</span><span>€{(parseFloat(formData.dagtarief)/(parseFloat(settings?.basisUrenDag) || 10)).toFixed(2)}</span></div>
                                        <div className="flex justify-between"><span>Kilometertarief:</span><span>€{parseFloat(formData.kmvergoeding).toFixed(2)}</span></div>
                                     </div>
                                </div>
                                <div className="mt-6 pt-4 border-t">
                                    <p className="text-gray-600 text-right">Totaal te factureren (excl. BTW)</p>
                                    <p className="text-4xl font-bold text-gray-900 text-right">€{result.grandTotal.toFixed(2)}</p>
                                </div>
                                 <div className="mt-6 flex flex-col gap-2">
                                    <button onClick={handleSave} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">{isEditMode ? 'Update Berekening' : 'Opslaan als Concept'}</button>
                                    <button onClick={() => alert("PDF export is een toekomstige feature.")} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Exporteer als PDF</button>
                                </div>
                            </div>
                        ) : ( <div className="text-center text-gray-500 py-10"><p>Vul het formulier in en klik op 'Bereken Totaal' om het resultaat te zien.</p></div> )}
                    </div>
                </div>
            </div>
        </div>
    );
};

//++++++++++++ MAIN APP COMPONENT ++++++++++++
export default function App() { return ( <DataProvider><Main /></DataProvider> ); }
const Main = () => { const { user, loading } = useContext(DataContext); const [currentView, setCurrentView] = useState('dashboard'); const [editingCalculation, setEditingCalculation] = useState(null); if (loading) { return <div className="min-h-screen flex items-center justify-center">Laden...</div> } if (!user) { return <LoginScreen />; } const renderView = () => { switch (currentView) { case 'new_calculation': return <CalculationForm setCurrentView={setCurrentView} editingCalculation={editingCalculation} setEditingCalculation={setEditingCalculation} />; case 'settings': return <SettingsScreen setCurrentView={setCurrentView} />; default: return <Dashboard setCurrentView={setCurrentView} setEditingCalculation={setEditingCalculation} />; } }; return ( <div className="min-h-screen bg-gray-50 font-sans"><Header /><main>{renderView()}</main></div> ); };
