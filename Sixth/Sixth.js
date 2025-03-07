const fromDropdown = document.getElementById("from-country");
        const toDropdown = document.getElementById("to-country");
        const amountInput = document.getElementById("Original");
        const convertedAmountInput = document.getElementById("To");
        const convertButton = document.getElementById("convert-btn");

        let exchangeRates = {};

        // Fetch currencies from API
        const fetchCurrencies = async () => {
            try {
                const response = await fetch('https://openexchangerates.org/api/currencies.json?app_id=33e3d46787104f3e9e71742c60be3b0d');
                if (!response.ok) {
                    throw new Error('Failed to fetch currencies');
                }
                const currencies = await response.json();
                populateDropdown(fromDropdown, currencies);
                populateDropdown(toDropdown, currencies);
            } catch (error) {
                console.error('Error fetching currencies:', error);
                alert('Failed to load currency list. Please try again later.');
            }
        };

        // Fetch exchange rates from API
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch('https://openexchangerates.org/api/latest.json?app_id=33e3d46787104f3e9e71742c60be3b0d');
                if (!response.ok) {
                    throw new Error('Failed to fetch exchange rates');
                }
                const data = await response.json();
                exchangeRates = data.rates;
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                alert('Failed to load exchange rates. Please try again later.');
            }
        };

        // Populate dropdown with currencies
        const populateDropdown = (dropdown, currencies) => {
            dropdown.innerHTML = ''; // Clear existing options
            Object.entries(currencies).forEach(([code, name]) => {
                const option = document.createElement("option");
                option.value = code;
                option.textContent = `${name} (${code})`;
                dropdown.appendChild(option);
            });
        };

        // Convert currency when button is clicked
        const convertCurrency = () => {
            const fromCurrency = fromDropdown.value;
            const toCurrency = toDropdown.value;
            const amount = parseFloat(amountInput.value);

            if (!fromCurrency || !toCurrency || isNaN(amount) || amount <= 0) {
                alert('Please select both currencies and enter a valid amount.');
                return;
            }

            const fromRate = exchangeRates[fromCurrency];
            const toRate = exchangeRates[toCurrency];

            if (!fromRate || !toRate) {
                alert('Unable to fetch exchange rates for the selected currencies.');
                return;
            }

            // Calculate the converted amount
            const convertedAmount = amount * (toRate / fromRate);
            convertedAmountInput.value = convertedAmount.toFixed(2); // Display result
        };

        // Initialize dropdowns and exchange rates
        fetchCurrencies();
        fetchExchangeRates();

        // Add event listener to convert button
        convertButton.addEventListener("click", convertCurrency);