# WeatherBot — Inteligentny doradca ubioru

WeatherBot to prosty, ale rozbudowany chatbot webowy stworzony w czystym JavaScript, HTML i CSS, którego głównym zadaniem jest doradzanie użytkownikowi, jak się ubrać w zależności od warunków pogodowych. Aplikacja działa w przeglądarce i nie wymaga żadnych zewnętrznych frameworków, co pozwala dobrze prześledzić całą logikę działania „od zera”.

Cały projekt został zaprojektowany w taki sposób, aby symulować rozmowę z asystentem pogodowym, który analizuje tekst wpisany przez użytkownika, rozpoznaje temperaturę oraz warunki atmosferyczne i na tej podstawie generuje spersonalizowaną rekomendację ubioru.

## Jak działa aplikacja

Po uruchomieniu aplikacji użytkownik widzi interfejs czatu, w którym może wpisać opis pogody w naturalnym języku, na przykład że jest zimno i pada deszcz albo że jest bardzo gorąco i słonecznie. System analizuje wpisany tekst i próbuje wyciągnąć z niego kluczowe informacje, takie jak temperatura oraz warunki pogodowe. Następnie na tej podstawie generowana jest odpowiedź, która zawiera propozycję ubioru, dodatków, a także wskazówki dotyczące ochrony przed warunkami atmosferycznymi.

Dodatkowo aplikacja potrafi pobierać rzeczywistą pogodę z API OpenWeatherMap, jeśli użytkownik poda nazwę miasta oraz swój klucz API. W przypadku braku klucza aplikacja przechodzi w tryb demonstracyjny i informuje użytkownika, jak go uzyskać.

## Architektura projektu

Projekt został podzielony na trzy główne warstwy: strukturę HTML odpowiedzialną za interfejs, CSS odpowiadający za wygląd oraz JavaScript, który stanowi rdzeń logiki całej aplikacji.

Warstwa JavaScript została dodatkowo podzielona logicznie na moduły w jednym pliku, obejmujące między innymi konfigurację, analizę tekstu użytkownika, generowanie rekomendacji ubioru, obsługę API pogodowego, zarządzanie interfejsem czatu, a także funkcje odpowiedzialne za przechowywanie historii rozmowy w LocalStorage oraz tryb ciemny.

Najważniejszą częścią systemu jest silnik rekomendacji ubioru, który na podstawie temperatury oraz wykrytych warunków pogodowych buduje dynamiczną odpowiedź, uwzględniającą różne scenariusze, od mrozu po upały, a także dodatkowe czynniki takie jak deszcz, wiatr czy burze.

## Interfejs użytkownika

Interfejs aplikacji został zaprojektowany w stylu nowoczesnego „glassmorphism”, z półprzezroczystymi elementami i animowanym tłem, aby nadać aplikacji bardziej interaktywny i estetyczny charakter. Użytkownik ma do dyspozycji szybkie sugestie pogodowe, które pozwalają jednym kliknięciem zasymulować różne warunki atmosferyczne i sprawdzić działanie bota.

Dodatkowo dostępny jest tryb ciemny, który zmienia cały motyw aplikacji i jest zapamiętywany w przeglądarce, dzięki czemu użytkownik nie musi go ustawiać ponownie przy każdym wejściu.

## Przechowywanie danych

Aplikacja wykorzystuje LocalStorage do zapisywania historii rozmów oraz preferencji użytkownika, takich jak tryb ciemny czy klucz API. Dzięki temu po odświeżeniu strony użytkownik nadal widzi poprzednią konwersację, co zwiększa płynność korzystania z aplikacji.

## Integracja z API pogodowym

WeatherBot może korzystać z OpenWeatherMap API, aby pobierać aktualne dane pogodowe dla wybranego miasta. Dane te są następnie przetwarzane i mapowane na warunki pogodowe, które są używane przez silnik rekomendacji ubioru.

## Podsumowanie

Projekt WeatherBot pokazuje, jak przy użyciu czystego JavaScript można stworzyć interaktywną aplikację typu chatbot, która łączy analizę tekstu, logikę decyzyjną oraz integrację z zewnętrznym API. Aplikacja jest w pełni działająca w przeglądarce i może być łatwo rozwijana o kolejne funkcje, takie jak bardziej zaawansowane NLP czy dodatkowe źródła danych pogodowych.

Szymon Żygas 40891

Patryk Hanneman 60594

Oscar Nowak 60583

Mateusz Baran 60631

aaa

