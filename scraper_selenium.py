from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import time
import pandas as pd
import re
import json
from datetime import datetime

# Configuración
OUTPUT_DIR = "data_real"
import os
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

class Inmuebles24Scraper:
    def __init__(self):
        print("Inicializando scraper de Inmuebles24...")
        
        # Configurar opciones de Chrome
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Ejecutar sin ventana
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        # Inicializar driver
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        
        self.properties = []
    
    def clean_price(self, price_text):
        """Limpia el texto del precio y lo convierte a número"""
        if not price_text:
            return None
        
        # Remover símbolos y texto
        price_text = price_text.replace('$', '').replace(',', '').replace(' ', '')
        price_text = re.sub(r'[^\d.]', '', price_text)
        
        try:
            return float(price_text)
        except:
            return None
    
    def extract_number(self, text):
        """Extrae números de un texto"""
        if not text:
            return None
        
        numbers = re.findall(r'\d+', text)
        if numbers:
            return int(numbers[0])
        return None
    
    def scrape_page(self, url, max_properties=50):
        """
        Scrape una página de Inmuebles24
        max_properties: cuántas propiedades extraer (para no sobrecargar)
        """
        print(f"\nAccediendo a: {url}")
        
        try:
            self.driver.get(url)
            time.sleep(3)  # Esperar a que cargue
            
            # Buscar elementos de propiedades
            # Nota: Los selectores pueden cambiar, estos son ejemplos comunes
            property_cards = self.driver.find_elements(By.CSS_SELECTOR, '[data-qa="posting PROPERTY"]')
            
            if not property_cards:
                property_cards = self.driver.find_elements(By.CLASS_NAME, 'posting-card')
            
            print(f"Encontradas {len(property_cards)} propiedades en la página")
            
            count = 0
            for card in property_cards[:max_properties]:
                if count >= max_properties:
                    break
                
                try:
                    property_data = self.extract_property_data(card)
                    if property_data:
                        self.properties.append(property_data)
                        count += 1
                        print(f"  Propiedad {count} extraída")
                except Exception as e:
                    print(f"  Error extrayendo propiedad: {e}")
                    continue
            
            print(f"\nTotal extraído de esta página: {count} propiedades")
            
        except Exception as e:
            print(f"Error accediendo a la página: {e}")
    
    def extract_property_data(self, card):
        """Extrae datos de una tarjeta de propiedad"""
        data = {}
        
        try:
            # Precio
            price_elem = card.find_element(By.CSS_SELECTOR, '[data-qa="POSTING_CARD_PRICE"]')
            data['precio'] = self.clean_price(price_elem.text)
            
            # Título
            title_elem = card.find_element(By.CSS_SELECTOR, '[data-qa="POSTING_CARD_TITLE"]')
            data['titulo'] = title_elem.text
            
            # Ubicación
            location_elem = card.find_element(By.CSS_SELECTOR, '[data-qa="POSTING_CARD_LOCATION"]')
            data['ubicacion'] = location_elem.text
            
            # Características (recámaras, baños, m2)
            features = card.find_elements(By.CLASS_NAME, 'posting-card-features-item')
            
            for feature in features:
                text = feature.text.lower()
                
                if 'rec' in text or 'dorm' in text:
                    data['recamaras'] = self.extract_number(text)
                elif 'baño' in text:
                    data['banos'] = self.extract_number(text)
                elif 'm²' in text or 'm2' in text:
                    data['metros_cuadrados'] = self.extract_number(text)
            
            # Determinar zona basado en ubicación
            ubicacion_lower = data.get('ubicacion', '').lower()
            
            if 'zona hotelera' in ubicacion_lower:
                data['zona'] = 'Zona Hotelera'
            elif 'puerto cancún' in ubicacion_lower or 'puerto cancun' in ubicacion_lower:
                data['zona'] = 'Puerto Cancún'
            elif 'centro' in ubicacion_lower:
                data['zona'] = 'Centro Cancún'
            elif 'región 15' in ubicacion_lower or 'region 15' in ubicacion_lower:
                data['zona'] = 'Región 15'
            elif 'playa del carmen' in ubicacion_lower:
                data['zona'] = 'Playa del Carmen'
            elif 'tulum' in ubicacion_lower:
                data['zona'] = 'Tulum'
            elif 'puerto morelos' in ubicacion_lower:
                data['zona'] = 'Puerto Morelos'
            else:
                data['zona'] = 'Centro Cancún'  # Default
            
            # Tipo de propiedad
            titulo_lower = data.get('titulo', '').lower()
            if 'departamento' in titulo_lower or 'depto' in titulo_lower:
                data['tipo'] = 'Departamento'
            elif 'casa' in titulo_lower:
                data['tipo'] = 'Casa'
            elif 'villa' in titulo_lower:
                data['tipo'] = 'Villa'
            elif 'penthouse' in titulo_lower:
                data['tipo'] = 'Penthouse'
            else:
                data['tipo'] = 'Departamento'  # Default
            
            data['fecha_scraping'] = datetime.now().strftime('%Y-%m-%d')
            
            return data
            
        except Exception as e:
            return None
    
    def save_data(self):
        """Guarda los datos extraídos"""
        if not self.properties:
            print("\nNo hay datos para guardar")
            return
        
        df = pd.DataFrame(self.properties)
        
        # Guardar CSV
        csv_file = f'{OUTPUT_DIR}/inmuebles24_cancun_{datetime.now().strftime("%Y%m%d")}.csv'
        df.to_csv(csv_file, index=False, encoding='utf-8-sig')
        print(f"\nDatos guardados en: {csv_file}")
        
        # Guardar JSON
        json_file = f'{OUTPUT_DIR}/inmuebles24_cancun_{datetime.now().strftime("%Y%m%d")}.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(self.properties, f, ensure_ascii=False, indent=2)
        print(f"Datos guardados en: {json_file}")
        
        # Mostrar resumen
        print("\n" + "=" * 70)
        print("RESUMEN DE DATOS EXTRAIDOS")
        print("=" * 70)
        print(f"Total de propiedades: {len(self.properties)}")
        print(f"\nPor zona:")
        print(df['zona'].value_counts())
        print(f"\nPor tipo:")
        print(df['tipo'].value_counts())
        print(f"\nPrecio promedio: ${df['precio'].mean():,.2f} MXN")
        print(f"Precio mínimo: ${df['precio'].min():,.2f} MXN")
        print(f"Precio máximo: ${df['precio'].max():,.2f} MXN")
    
    def close(self):
        """Cierra el navegador"""
        self.driver.quit()
        print("\nNavegador cerrado")

def main():
    print("=" * 70)
    print("  WEB SCRAPER INMUEBLES24 - PROPIEDADES REALES DE CANCUN")
    print("=" * 70)
    print()
    
    scraper = Inmuebles24Scraper()
    
    try:
        # URL de Inmuebles24 Cancún
        url = "https://www.inmuebles24.com/inmuebles-en-cancun.html"
        
        # Scrape (limitado a 50 propiedades para no sobrecargar)
        scraper.scrape_page(url, max_properties=50)
        
        # Guardar datos
        scraper.save_data()
        
    except Exception as e:
        print(f"\nError durante el scraping: {e}")
        print("Esto puede ocurrir si el sitio bloquea el acceso o cambió su estructura")
    
    finally:
        scraper.close()
    
    print("\n" + "=" * 70)
    print("SCRAPING COMPLETADO")
    print("=" * 70)
    print("\nSiguiente paso: Ejecutar 'combine_data.py' para combinar con datos de Lamudi")

if __name__ == "__main__":
    main()