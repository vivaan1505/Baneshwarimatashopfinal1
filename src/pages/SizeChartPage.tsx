import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SizeChartPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'footwear';
  
  const [activeTab, setActiveTab] = useState<string>(category);

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link to="/" className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 dark:bg-gray-800">
          <h1 className="text-3xl font-heading font-bold mb-6 dark:text-white">Size Charts</h1>
          <p className="text-gray-600 mb-8 dark:text-gray-300">
            Find the perfect fit with our detailed size charts for all product categories. 
            Use these measurements as a guide to help you select the right size.
          </p>

          {/* Category Tabs */}
          <div className="border-b mb-8 dark:border-gray-700">
            <div className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab('footwear')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'footwear'
                    ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                Footwear
              </button>
              <button
                onClick={() => setActiveTab('clothing')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'clothing'
                    ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                Clothing
              </button>
              <button
                onClick={() => setActiveTab('jewelry')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'jewelry'
                    ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                Jewelry
              </button>
              <button
                onClick={() => setActiveTab('accessories')}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'accessories'
                    ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                Accessories
              </button>
            </div>
          </div>

          {/* Footwear Size Chart */}
          {activeTab === 'footwear' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-medium mb-4 dark:text-white">Footwear Size Chart</h2>
                <p className="text-gray-600 mb-6 dark:text-gray-300">
                  To find your shoe size, measure your foot length from heel to toe while standing on a flat surface. 
                  Compare your measurement with the chart below. If you're between sizes, we recommend sizing up.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Women's Footwear</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">US</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">EU</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">UK</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Foot Length (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Foot Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">35-36</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">3</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8.5"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">21.6 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36-37</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8.75"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">22.2 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">37-38</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">22.9 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">38-39</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9.25"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">23.5 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">39-40</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9.5"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">24.1 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">40-41</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9.75"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">24.8 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">11</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">41-42</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">25.4 cm</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Men's Footwear</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">US</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">EU</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">UK</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Foot Length (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Foot Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">40</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9.6"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">24.4 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">41</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9.9"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">25.1 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">42</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10.2"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">25.9 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">43</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10.5"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">26.7 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">11</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">44</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10.8"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">27.5 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">12</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">45</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">11</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">11.2"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">28.4 cm</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">13</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">46</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">12</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">11.5"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">29.2 cm</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Kids' Footwear</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">US</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">EU</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">UK</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Foot Length (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Foot Length (cm)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Age (approx.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10C</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">27</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6.25"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">15.9 cm</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">4 years</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">11C</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">28</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6.5"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">16.5 cm</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">4-5 years</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">12C</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">30</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">11</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6.75"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">17.1 cm</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5-6 years</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">13C</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">31</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">12</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">17.8 cm</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6-7 years</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">1Y</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">32</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">13</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7.25"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">18.4 cm</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7-8 years</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">2Y</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">33</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">1</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7.625"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">19.4 cm</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8-9 years</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">3Y</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">34</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">2</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8"</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">20.3 cm</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9-10 years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8 dark:bg-gray-700">
                <h3 className="text-lg font-medium mb-3 dark:text-white">How to Measure Your Foot</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Place a piece of paper on a hard floor against a wall.</li>
                  <li>Stand on the paper with your heel against the wall.</li>
                  <li>Mark the longest part of your foot on the paper.</li>
                  <li>Measure the distance from the wall to the mark in centimeters or inches.</li>
                  <li>Use this measurement to find your size in the chart above.</li>
                </ol>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  <strong>Tip:</strong> Measure both feet and use the larger measurement, as most people have one foot slightly larger than the other.
                </p>
              </div>
            </div>
          )}

          {/* Clothing Size Chart */}
          {activeTab === 'clothing' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-medium mb-4 dark:text-white">Clothing Size Chart</h2>
                <p className="text-gray-600 mb-6 dark:text-gray-300">
                  Our clothing sizes are designed to fit true to size. For the best fit, take your measurements and refer to the charts below.
                  If you're between sizes, we recommend sizing up for a more comfortable fit.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Women's Clothing</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">US</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Bust (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Waist (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Hips (inches)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XS</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">0-2</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">32-33</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">24-25</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">34-35</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">S</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">4-6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">34-35</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">26-27</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36-37</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">M</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8-10</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36-37</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">28-29</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">38-39</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">L</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">12-14</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">38-40</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">30-32</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">40-42</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XL</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">16-18</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">41-43</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">33-35</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">43-45</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XXL</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">20-22</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">44-46</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36-38</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">46-48</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Men's Clothing</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Chest (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Waist (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Neck (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Sleeve (inches)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XS</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">34-36</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">28-30</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">14-14.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">32-33</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">S</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36-38</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">30-32</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">14.5-15</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">33-34</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">M</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">38-40</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">32-34</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">15-15.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">34-35</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">L</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">40-42</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">34-36</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">15.5-16</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">35-36</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XL</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">42-44</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36-38</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">16-16.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36-37</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XXL</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">44-46</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">38-40</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">16.5-17</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">37-38</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Kids' Clothing</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Age (years)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Height (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Weight (lbs)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Chest (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Waist (inches)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">2T</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">2</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">33-35</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">28-32</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">21</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">20</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">3T</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">3</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">35-38</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">32-35</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">22</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">20.5</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">4T</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">38-41</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">35-39</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">23</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">21</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">41-44</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">39-45</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">24</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">21.5</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">44-47</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">45-50</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">25</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">22</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">47-50</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">50-57</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">26</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">22.5</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">50-53</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">57-66</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">27</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">23</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8 dark:bg-gray-700">
                <h3 className="text-lg font-medium mb-3 dark:text-white">How to Measure</h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="font-medium">Bust/Chest:</p>
                    <p>Measure around the fullest part of your chest, keeping the measuring tape horizontal.</p>
                  </div>
                  <div>
                    <p className="font-medium">Waist:</p>
                    <p>Measure around your natural waistline, keeping the tape comfortably loose.</p>
                  </div>
                  <div>
                    <p className="font-medium">Hips:</p>
                    <p>Measure around the fullest part of your hips, about 8 inches below your waistline.</p>
                  </div>
                  <div>
                    <p className="font-medium">Inseam:</p>
                    <p>Measure from the crotch to the bottom of the leg.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Jewelry Size Chart */}
          {activeTab === 'jewelry' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-medium mb-4 dark:text-white">Jewelry Size Chart</h2>
                <p className="text-gray-600 mb-6 dark:text-gray-300">
                  Finding the right size for your jewelry is essential for comfort and style. Use our detailed size charts below to find your perfect fit.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Ring Size Chart</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">US Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">UK Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">EU Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Diameter (mm)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Circumference (mm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">3</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">F</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">44</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">14.1</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">44.2</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">H</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">47</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">14.8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">46.5</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">J</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">49</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">15.6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">49.0</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">L</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">51.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">16.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">51.8</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">N</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">54</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">17.3</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">54.4</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">P</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">57</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">18.1</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">56.9</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">R</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">60</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">18.9</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">59.5</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">T</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">62</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">19.8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">62.1</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">11</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">V</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">65</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">20.6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">64.6</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">12</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">X</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">67</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">21.4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">67.2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Necklace Length Guide</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Style</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Length (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Length (cm)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Position on Body</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Choker</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">14-16</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">35-41</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Sits directly against the throat</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Princess</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">18</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">45</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Rests on the collarbone</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Matinee</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">20-24</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">50-61</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Falls between the collarbone and the bust</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Opera</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">28-36</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">71-91</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Falls below the bust, can be doubled</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Rope</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36+</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">91+</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Long enough to wrap multiple times</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Bracelet Size Guide</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Wrist Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Recommended Bracelet Length</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Fit Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5-5.5 inches (12.7-14 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6-6.5 inches (15.2-16.5 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Snug fit</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5-5.5 inches (12.7-14 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 inches (17.8 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Loose fit</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6-6.5 inches (15.2-16.5 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7-7.5 inches (17.8-19 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Snug fit</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6-6.5 inches (15.2-16.5 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8 inches (20.3 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Loose fit</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7-7.5 inches (17.8-19 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8-8.5 inches (20.3-21.6 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Snug fit</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7-7.5 inches (17.8-19 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9 inches (22.9 cm)</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">Loose fit</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8 dark:bg-gray-700">
                <h3 className="text-lg font-medium mb-3 dark:text-white">How to Measure for Jewelry</h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="font-medium">Ring Size:</p>
                    <p>Wrap a piece of string or paper around your finger. Mark where the ends meet and measure the length in millimeters. Compare to the circumference in our ring size chart.</p>
                  </div>
                  <div>
                    <p className="font-medium">Bracelet Size:</p>
                    <p>Measure your wrist just below the wrist bone. Add 1/2 inch for a snug fit or 1 inch for a looser fit.</p>
                  </div>
                  <div>
                    <p className="font-medium">Necklace Length:</p>
                    <p>Measure from the base of your neck to where you want the necklace to fall. Alternatively, measure a necklace you already own that fits well.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Accessories Size Chart */}
          {activeTab === 'accessories' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-medium mb-4 dark:text-white">Accessories Size Chart</h2>
                <p className="text-gray-600 mb-6 dark:text-gray-300">
                  Find the perfect fit for your accessories with our comprehensive size guides. From hats to gloves, we've got you covered.
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Hat Size Chart</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">US</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">UK</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">EU</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Head Circumference (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Head Circumference (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XS</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6 3/4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6 5/8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">54</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">21 1/4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">54</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">S</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6 7/8 - 7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6 3/4 - 6 7/8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">55 - 56</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">21 5/8 - 22</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">55 - 56</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">M</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 1/8 - 7 1/4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 - 7 1/8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">57 - 58</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">22 3/8 - 22 3/4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">57 - 58</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">L</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 3/8 - 7 1/2</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 1/4 - 7 3/8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">59 - 60</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">23 1/8 - 23 1/2</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">59 - 60</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XL</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 5/8 - 7 3/4</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 1/2 - 7 5/8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">61 - 62</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">24 - 24 3/8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">61 - 62</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XXL</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 7/8 - 8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 3/4 - 7 7/8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">63 - 64</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">24 3/4 - 25 1/8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">63 - 64</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Glove Size Chart</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Size</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Hand Circumference (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Hand Circumference (cm)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Hand Length (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Hand Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XS</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6 - 6.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">15.2 - 16.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">5.5 - 6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">14 - 15.2</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">S</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7 - 7.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">17.8 - 19</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">6.5 - 7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">16.5 - 17.8</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">M</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8 - 8.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">20.3 - 21.6</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">7.5 - 8</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">19 - 20.3</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">L</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9 - 9.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">22.9 - 24.1</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">8.5 - 9</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">21.6 - 22.9</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">XL</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">10 - 10.5</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">25.4 - 26.7</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">9.5 - 10</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">24.1 - 25.4</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 dark:text-white">Belt Size Chart</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Pant Size (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Belt Size (inches)</th>
                          <th className="py-3 px-4 text-left border-b dark:border-gray-600">Belt Size (cm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">28-30</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">30-32</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">76-81</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">32-34</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">34-36</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">86-91</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">36-38</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">38-40</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">97-102</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">40-42</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">42-44</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">107-112</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b dark:border-gray-600">44-46</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">46-48</td>
                          <td className="py-3 px-4 border-b dark:border-gray-600">117-122</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-8 dark:bg-gray-700">
                <h3 className="text-lg font-medium mb-3 dark:text-white">How to Measure for Accessories</h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="font-medium">Hat Size:</p>
                    <p>Measure around your head about 1/2 inch above your eyebrows and ears, where the hat will sit.</p>
                  </div>
                  <div>
                    <p className="font-medium">Glove Size:</p>
                    <p>Measure around your dominant hand at the widest part (excluding thumb). For length, measure from the tip of your middle finger to your wrist.</p>
                  </div>
                  <div>
                    <p className="font-medium">Belt Size:</p>
                    <p>Measure your current belt from the hole you use to the end of the belt where it meets the buckle. Alternatively, add 2 inches to your pant waist size.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 p-6 bg-primary-50 rounded-lg dark:bg-primary-900/20">
            <h3 className="text-lg font-medium mb-3 dark:text-white">Need More Help?</h3>
            <p className="text-gray-600 mb-4 dark:text-gray-300">
              If you're still unsure about your size or have specific questions, our customer service team is here to help.
            </p>
            <Link to="/contact" className="btn-primary inline-flex">
              Contact Customer Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartPage;