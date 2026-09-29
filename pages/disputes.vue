<template>
  <div>
    
    
    <main class="flex-1 p-8">
      <h2 class="text-3xl font-black mb-6">Escrow Disputes</h2>
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="p-4 font-bold text-slate-600">Transaction ID</th>
              <th class="p-4 font-bold text-slate-600">Amount</th>
              <th class="p-4 font-bold text-slate-600">Status</th>
              <th class="p-4 font-bold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="p-4 font-mono text-sm text-slate-700">TX-993821</td>
              <td class="p-4 font-bold text-slate-900">₦35,000</td>
              <td class="p-4"><span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Disputed</span></td>
              <td class="p-4"><button class="text-blue-600 font-bold hover:underline">Review</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>